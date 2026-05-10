import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Staff } from '../../src/models/staff/staffSchema';

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
    medicalLicenseNumber: 55555,
    name: 'Dr Spec',
    specialty: 'cardiología',
    professionalCategory: 'médico adjunto',
    turn: 'mañana',
    floor: 3,
    yearsOfExperience: 8,
    departmentContactData: { phone: '600555555', email: 'spec@test.com' },
    state: 'activo'
  } as const;

  test('GET /staff/:id devuelve 200 y el staff', async () => {
    const created = await Staff.create(validStaff);

    const res = await request(app).get(`/staff/${created._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body._id).toBe(String(created._id));
    expect(res.body.name).toBe(validStaff.name);
  });

  test('GET /staff/:id devuelve 400 si id inválido', async () => {
    const res = await request(app).get('/staff/invalid-id');
    expect(res.status).toBe(400);
  });

  test('GET /staff/:id devuelve 404 si no existe', async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/staff/${id}`);
    expect(res.status).toBe(404);
  });

});
