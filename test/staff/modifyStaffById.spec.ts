import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Staff } from '../../src/models/staff/staffSchema';
import * as staffService from '../../src/services/staff/modifyStaffById.js';

describe('Pruebas para modifyStaffByIdController', () => {

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Staff.deleteMany();
  });

  const validStaff = {
    medicalLicenseNumber: 12345,
    name: "Dr Test",
    specialty: "cardiología" as const,
    professionalCategory: "médico adjunto" as const,
    turn: "mañana" as const,
    floor: 2,
    yearsOfExperience: 10,
    departmentContactData: {
      phone: "600123456",
      email: "staff@test.com"
    },
    state: "activo" as const
  };

  test('Debe modificar un staff y devolver 200', async () => {
    const created = await Staff.create(validStaff);

    const res = await request(app)
      .patch(`/staff/${created._id}`)
      .send({ name: "Dr Updated" });

    expect(res.status).toBe(200);

    const updated = await Staff.findById(created._id);
    expect(updated?.name).toBe("Dr Updated");
  });

  test('Debe devolver 404 si el staff no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/staff/${fakeId}`)
      .send({ name: "Dr Updated" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Staff member not found');
  });

  test('Debe devolver 400 si hay error de validación', async () => {
    const created = await Staff.create(validStaff);

    const res = await request(app)
      .patch(`/staff/${created._id}`)
      .send({ specialty: "informatica" }); // enum inválido

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('is not a valid enum value');
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const created = await Staff.create(validStaff);

    const spy = vi
      .spyOn(staffService, 'modifyStaffById')
      .mockRejectedValueOnce(new Error('Error interno'));

    const res = await request(app)
      .patch(`/staff/${created._id}`)
      .send({ name: "Dr Updated" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error interno');

    spy.mockRestore();
  });

});