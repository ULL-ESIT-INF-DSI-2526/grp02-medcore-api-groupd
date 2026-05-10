import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Patient } from '../../src/models/patients/patientSchema';

describe('Test para comprobar el funcionamiento del controlador deletePatients', () => {
  const paciente1 = {
    idenNumber: '12345678Z',
    name: 'Juan Pérez',
    birthDate: '1990-05-15T00:00:00.000Z',
    SSId: '123456789012',
    gender: 'male' as const,
    bloodType: 'A+' as const,
    contactData: {
      address: 'Calle Falsa',
      phoneNumber: '600123456',
      email: 'juan@test.com',
    },
  };

  const paciente2 = {
    idenNumber: '48210567Z',
    name: 'Juanma García',
    birthDate: '1985-10-20',
    SSId: '222222222222',
    gender: 'male' as const,
    bloodType: 'B-' as const,
    contactData: {
      address: 'Calle 2',
      phoneNumber: '600000002',
      email: 'juan2@test.com',
    },
  };

  const paciente3 = {
    idenNumber: '53912754H',
    name: 'Ana López',
    birthDate: '1992-01-10',
    SSId: '333333333333',
    gender: 'female' as const,
    bloodType: '0+' as const,
    contactData: {
      address: 'Calle 3',
      phoneNumber: '600000003',
      email: 'ana@test.com',
    },
  };

  beforeAll(async () => {
    await connectDB();
    await Patient.deleteMany();
    await Patient.create([paciente1, paciente2, paciente3]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe eliminar un paciente por su id y devolver su información', async () => {
    const resToId = await Patient.find({ idenNumber: '12345678Z' });
    const res = await request(app).delete(`/patients/${resToId[0]._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(paciente1);
  });

  test('Debe devolver un error 404 si no se encuentra un paciente con el id', async () => {
    const res = await request(app).delete('/patients/69f473e840f5b1f3cd7852f7');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(
      'Patient with id (69f473e840f5b1f3cd7852f7) not found unable to delete',
    );
  });

  test('Debe devolver un error 400 si no se especifica un id valido para MongoDB', async () => {
    const res = await request(app).delete('/patients/789');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('Invalid MongoDB id format');
  });

  test('Debe devolver un error 500 si simulamos un error en el server', async () => {
    const spy = vi
      .spyOn(Patient, 'findByIdAndDelete')
      .mockRejectedValueOnce(new Error('Database error: Is down'));

    const resForId = await Patient.find({ idenNumber: '48210567Z' });
    const res = await request(app).delete(`/patients/${resForId[0]._id}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database error: Is down');

    spy.mockRestore();
  });
});
