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
import * as staffService from '../../src/services/staff/modifyStaff.js';

describe('Pruebas para modifyStaffController (por filtro)', () => {

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

  test('Debe modificar por nombre y devolver 200', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch(`/staff`)
      .query({ name: "Dr Test" })
      .send({ floor: 5 });

    expect(res.status).toBe(200);

    const updated = await Staff.findOne({ name: "Dr Test" });
    expect(updated?.floor).toBe(5);
  });

  test('Debe modificar por especialidad', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch(`/staff`)
      .query({ specialty: "cardiología" })
      .send({ turn: "tarde" });

    expect(res.status).toBe(200);

    const updated = await Staff.findOne({ specialty: "cardiología" });
    expect(updated?.turn).toBe("tarde");
  });

  test('No modifica nada si no encuentra coincidencias', async () => {
    const res = await request(app)
      .patch(`/staff`)
      .query({ name: "No existe" })
      .send({ floor: 9 });

    expect(res.status).toBe(404);
  });

  test('Debe devolver 400 si hay error de validación', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch(`/staff`)
      .query({ name: "Dr Test" })
      .send({ specialty: "informatica" }); // inválido

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('is not a valid enum value');
  });

  test('Debe devolver 404 si no encuentra coincidencias', async () => {
    const res = await request(app)
      .patch(`/staff`)
      .query({ name: "No existe" })
      .send({ floor: 9 });

    expect(res.status).toBe(404);
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const spy = vi
      .spyOn(staffService, 'modifyStaff')
      .mockRejectedValueOnce(new Error('Error interno'));

    const res = await request(app)
      .patch(`/staff`)
      .query({ name: "Dr Test" })
      .send({ floor: 3 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error interno');

    spy.mockRestore();
  });

});