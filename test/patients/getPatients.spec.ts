import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Patient } from '../../src/models/patients/patientSchema';

describe('Pruebas para comprobar el funcionamiento del controlador de getPatients', () => {
  const paciente1 = {
    idenNumber: '12345678Z',
    name: 'Juan Pérez',
    birthDate: '1990-05-15',
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

  test('Debe devolver todos los pacientes si se pasa sin filtro', async () => {
    const res = await request(app).get('/patients');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  test('Debe retornar la información de Juan cuando se busca por su id', async () => {
    const res = await request(app).get('/patients?name=Juan Pérez');

    expect(res.status).toBe(200);
    expect(res.body[0].idenNumber).toEqual('12345678Z');
  });

  test('Debe devolver al paciente 2 si se busca por DNI', async () => {
    const res = await request(app).get('/patients?idenNumber=48210567Z');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toEqual('Juanma García');
  });

  test('Debe devolver dos pacientes si se busca solo por juan (Juan y Juanma)', async () => {
    const res = await request(app).get('/patients?name=juan');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Debe devolver solo a Juan si se especifica name=juan y su id', async () => {
    const res = await request(app).get(
      '/patients?name=juan&idenNumber=12345678Z',
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Juan Pérez');
  });

  test('Debe devolver un 404 si es busca por algo que no está', async () => {
    const res = await request(app).get('/patients?idenNumber=11111111G');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual('Not found any patient with this criteria');
  });

  test('Debe devolver un 404 si el DNI y el nombre no son de las misma persona', async () => {
    const res = await request(app).get(
      '/patients?name=ana&idenNumber=12345678Z',
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual('Not found any patient with this criteria');
  });

  test('Debe devolver 500 si la base de datos falla al buscar', async () => {
    const spy = vi
      .spyOn(Patient, 'find')
      .mockRejectedValueOnce(new Error('Database error: Is down'));

    const res = await request(app).get('/patients');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database error: Is down');

    spy.mockRestore();
  });
});
