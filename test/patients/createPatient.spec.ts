import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Patient } from '../../src/models/patients/patientSchema';

describe('Pruebas para el controlador de creación de pacientes', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Patient.deleteMany();
  });

  const pacienteValido = {
    idenNumber: '12345678Z',
    name: 'Juan Pérez',
    birthDate: '1990-05-15',
    SSId: '123456789012',
    gender: 'male',
    bloodType: 'A+',
    contactData: {
      address: 'Calle Falsa',
      phoneNumber: '600123456',
      email: 'juan@test.com',
    },
  };

  test('Debe guardar el paciente y devolver 201', async () => {
    const res = await request(app).post('/patients').send(pacienteValido);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Juan Pérez');

    const patientById = await Patient.findById(res.body._id);
    expect(patientById).not.toBeNull();
  });
});
