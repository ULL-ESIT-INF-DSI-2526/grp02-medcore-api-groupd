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
import * as staffService from '../../src/services/staff/deleteStaffById.js';

describe('Pruebas para deleteStaffByIdController', () => {

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

  test('Debe eliminar un staff y devolver 200', async () => {
    const created = await Staff.create(validStaff);

    const res = await request(app).delete(`/staff/${created._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Staff member deleted successfully');

    const deleted = await Staff.findById(created._id);
    expect(deleted).toBeNull();
  });

  test('Debe devolver 404 si el staff no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).delete(`/staff/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Staff member not found');
  });

  test('Debe devolver 400 si el id es inválido', async () => {
    const res = await request(app).delete(`/staff/id-invalido`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid ID format');
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const validId = new mongoose.Types.ObjectId();

    const spy = vi
      .spyOn(staffService, 'deleteStaffById')
      .mockRejectedValueOnce(new Error('Error interno'));

    const res = await request(app).delete(`/staff/${validId}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error interno');

    spy.mockRestore();
  });

});