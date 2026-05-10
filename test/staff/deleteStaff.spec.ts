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
import * as staffService from '../../src/services/staff/deleteStaff.js';

describe('Pruebas para deleteStaffController (por filtro)', () => {

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

  test('Debe eliminar por nombre y devolver 200', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .delete('/staff')
      .query({ name: "Dr Test" });

    expect(res.status).toBe(200);

    const remaining = await Staff.findOne({ name: "Dr Test" });
    expect(remaining).toBeNull();
  });

  test('Debe eliminar por especialidad', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .delete('/staff')
      .query({ specialty: "cardiología" });

    expect(res.status).toBe(200);

    const remaining = await Staff.findOne({ specialty: "cardiología" });
    expect(remaining).toBeNull();
  });

  test('Debe devolver 400 si no se proporciona filtro', async () => {
    const res = await request(app)
      .delete('/staff');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No valid filter provided');
  });

  test('Debe devolver 404 si no encuentra coincidencias', async () => {
    const res = await request(app)
      .delete('/staff')
      .query({ name: "No existe" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Staff not found');
  });

  test('Debe devolver 400 si hay error de validación', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .delete('/staff')
      .query({ specialty: "informatica" }); // enum inválido

    expect(res.status).toBe(400);
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const spy = vi
      .spyOn(staffService, 'deleteStaff')
      .mockRejectedValueOnce(new Error('Error interno'));

    const res = await request(app)
      .delete('/staff')
      .query({ name: "Dr Test" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error interno');

    spy.mockRestore();
  });

});