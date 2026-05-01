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

describe('Pruebas para el controlador de creación de staff', () => {

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
    medicalLicenseNumber: "12345",
    name: "Dr. Test",
    specialty: "cardiología",
    professionalCategory: "médico adjunto",
    turn: "mañana",
    floor: 2,
    yearsOfExperience: 10,
    departmentContactData: {
      phone: "600123456",
      email: "staff@test.com"
    },
    state: "activo"
  };

  test('Debe guardar el staff y devolver 201', async () => {
    const res = await request(app).post('/staff').send(validStaff);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Dr. Test");

    const staff = await Staff.findById(res.body._id);
    expect(staff).not.toBeNull();
  });

  test('Debe devolver 409 si el medicalLicenseNumber está duplicado', async () => {
    await request(app).post('/staff').send(validStaff);
    const res = await request(app).post('/staff').send(validStaff);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Staff member already exists in the system');
  });

  test('Debe devolver 400 si falta un campo obligatorio (name)', async () => {
    const invalidStaff = {
      ...validStaff,
      name: undefined
    };

    const res = await request(app).post('/staff').send(invalidStaff);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('name');
  });

  test('Debe devolver 400 si el enum de specialty es inválido', async () => {
    const invalidStaff = {
      ...validStaff,
      specialty: "informatica"
    };

    const res = await request(app).post('/staff').send(invalidStaff);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('is not a valid enum value');
  });

  test('Debe devolver 400 si falta un campo numérico obligatorio (floor)', async () => {
    const invalidStaff = {
      ...validStaff,
      floor: undefined
    };

    const res = await request(app).post('/staff').send(invalidStaff);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('floor');
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const spy = vi
      .spyOn(Staff.prototype, 'save')
      .mockRejectedValueOnce(new Error('Error crítico'));

    const res = await request(app).post('/staff').send(validStaff);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error crítico');

    spy.mockRestore();
  });

});