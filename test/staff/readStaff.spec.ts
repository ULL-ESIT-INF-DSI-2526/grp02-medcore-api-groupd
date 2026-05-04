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
import * as staffService from '../../src/services/staff/readStaffById.js';

describe('Pruebas para readStaffByIdController', () => {

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

  test('Debe devolver 200 y el staff si existe', async () => {
    const created = await Staff.create(validStaff);

    const res = await request(app).get(`/staff/${created._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(created._id.toString());
  });

  test('Debe devolver 404 si no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/staff/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Staff member not found');
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const validId = new mongoose.Types.ObjectId();
    const spy = vi
      .spyOn(staffService, 'readStaffById')
      .mockRejectedValueOnce(new Error('Fallo interno'));

    const res = await request(app).get(`/staff/${validId}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Fallo interno');

    spy.mockRestore();
  });

});