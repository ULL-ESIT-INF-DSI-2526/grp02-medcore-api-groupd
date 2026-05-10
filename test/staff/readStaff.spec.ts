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
import * as staffService from '../../src/services/staff/readStaff.js';

describe('Pruebas para readStaffController', () => {

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Staff.deleteMany();
  });

  const doctor1 = {
    medicalLicenseNumber: 11111,
    name: 'Dr House',
    specialty: 'cardiología' as const,
    professionalCategory: 'médico adjunto' as const,
    turn: 'mañana' as const,
    floor: 1,
    yearsOfExperience: 15,
    departmentContactData: {
      phone: '600111111',
      email: 'house@test.com',
    },
    state: 'activo' as const,
  };

  const doctor2 = {
    medicalLicenseNumber: 22222,
    name: 'Dr Wilson',
    specialty: 'urgencias' as const,
    professionalCategory: 'médico residente' as const,
    turn: 'tarde' as const,
    floor: 2,
    yearsOfExperience: 5,
    departmentContactData: {
      phone: '600222222',
      email: 'wilson@test.com',
    },
    state: 'activo' as const,
  };

  test('Debe devolver 200 y todos los staffs sin filtros', async () => {
    await Staff.insertMany([doctor1, doctor2]);

    const res = await request(app).get('/staff');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Debe filtrar por nombre', async () => {
    await Staff.insertMany([doctor1, doctor2]);

    const res = await request(app)
      .get('/staff')
      .query({ name: 'Dr House' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Dr House');
  });

  test('Debe filtrar por especialidad', async () => {
    await Staff.insertMany([doctor1, doctor2]);

    const res = await request(app)
      .get('/staff')
      .query({ specialty: 'urgencias' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].specialty).toBe('urgencias');
  });

  test('Debe filtrar por nombre y especialidad a la vez', async () => {
    await Staff.insertMany([doctor1, doctor2]);

    const res = await request(app)
      .get('/staff')
      .query({
        name: 'Dr House',
        specialty: 'cardiología',
      });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Dr House');
    expect(res.body[0].specialty).toBe('cardiología');
  });

  test('Debe devolver array vacío si no encuentra coincidencias', async () => {
    await Staff.insertMany([doctor1, doctor2]);

    const res = await request(app)
      .get('/staff')
      .query({ name: 'Doctor Inexistente' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('Debe ignorar query strings vacíos', async () => {
    await Staff.insertMany([doctor1, doctor2]);

    const res = await request(app)
      .get('/staff')
      .query({
        name: '',
        specialty: '',
      });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const spy = vi
      .spyOn(staffService, 'readStaff')
      .mockRejectedValueOnce(new Error('Fallo interno'));

    const res = await request(app).get('/staff');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Fallo interno');

    spy.mockRestore();
  });

  test('Debe devolver 400 si ocurre un ValidationError', async () => {
    const validationError = new mongoose.Error.ValidationError();

    const spy = vi
      .spyOn(staffService, 'readStaff')
      .mockRejectedValueOnce(validationError);

    const res = await request(app).get('/staff');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Validation failed');

    spy.mockRestore();
  });

});