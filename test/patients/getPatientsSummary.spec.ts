import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Patient } from '../../src/models/patients/patientSchema';

type GroupStat = {
  _id: string;
  count: number;
};

describe('Pruebas para comprobar el funcionamiento del controlador getPatientsSummary', () => {
  const paciente1 = {
    idenNumber: '12345678Z',
    name: 'Juan Pérez',
    birthDate: '1990-05-15',
    SSId: '123456789012',
    gender: 'male' as const,
    bloodType: 'A+' as const,
    status: 'active' as const,
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
    status: 'active' as const,
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
    status: 'active' as const,
    contactData: {
      address: 'Calle 3',
      phoneNumber: '600000003',
      email: 'ana@test.com',
    },
  };

  const pacienteFallecido = {
    idenNumber: '33333333P',
    name: 'Pedro Quevedo',
    birthDate: '1940-01-10',
    SSId: '444444444444',
    gender: 'male' as const,
    bloodType: 'A+' as const,
    contactData: {
      address: 'Calle 3',
      phoneNumber: '600000003',
      email: 'pedro@test.com',
    },
    status: 'deceased' as const,
    isCronic: true,
  };

  beforeAll(async () => {
    await connectDB();
    await Patient.deleteMany();
    await Patient.create([paciente1, paciente2, paciente3, pacienteFallecido]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe devolver las estadisticas correctamente', async () => {
    const res = await request(app).get('/patients/summary');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);

    const numMales = res.body.byGender.find((g: GroupStat) => g._id === 'male');
    expect(numMales.count).toBe(3);

    const aPlusStats = res.body.byBloodType.find(
      (b: GroupStat) => b._id === 'A+',
    );
    expect(aPlusStats.count).toBe(2);
  });

  test('Debe devolver un 404 si la base de datos no tiene documentos', async () => {
    await Patient.deleteMany();

    const res = await request(app).get('/patients/summary');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual('Database is empty');
  });

  test('Debe devolver 500 si la base de datos falla al buscar', async () => {
    const spy = vi
      .spyOn(Patient, 'countDocuments')
      .mockRejectedValueOnce(new Error('Database error: Is down'));

    const res = await request(app).get('/patients/summary');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database error: Is down');

    spy.mockRestore();
  });
});
