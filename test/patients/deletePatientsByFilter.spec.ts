import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  vi,
  beforeEach,
} from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Patient } from '../../src/models/patients/patientSchema';

describe('Pruebas para comprobar el funcionamiento del controlador deletePatientsByFilter', () => {
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
    isCronic: true,
  };

  const paciente3 = {
    idenNumber: '53912754H',
    name: 'Ana López',
    birthDate: '1992-01-10',
    SSId: '333333333333',
    gender: 'female' as const,
    bloodType: '0+' as const,
    status: 'active' as const,
    isCronic: true,
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
  });

  beforeEach(async () => {
    await Patient.deleteMany();
    await Patient.create([paciente1, paciente2, paciente3, pacienteFallecido]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe eliminar los pacientes fallecidos si se le pasa en la query', async () => {
    const res = await request(app).delete('/patients?status=deceased');

    expect(res.status).toBe(200);
    expect(res.body.deletedCount).toBe(1);

    expect((await Patient.find({ status: 'deceased' })).length).toBe(0);
  });

  test('Debe eliminar los pacientes cronicos si se le pasa en la query', async () => {
    const res = await request(app).delete('/patients?isCronic=true');

    expect(res.status).toBe(200);
    expect(res.body.deletedCount).toBe(3);

    expect((await Patient.find({ isCronic: true })).length).toBe(0);
  });

  test('Debe permitir eliminar con los dos filtros al mismo tiempo', async () => {
    const res = await request(app).delete(
      '/patients?status=deceased&isCronic=true',
    );

    expect(res.status).toBe(200);
    expect(res.body.deletedCount).toBe(1);

    expect(
      (await Patient.find({ isCronic: true, status: 'deceased' })).length,
    ).toBe(0);
  });

  test('Debe devolver 400 si se pasa un estado que no es valido (active, temporary leave, deceased)', async () => {
    const res = await request(app).delete('/patients?status=sleeping');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      `El estado 'sleeping' no es válido. Opciones permitidas: active, temporary leave, deceased.`,
    );
  });

  test('Debe devolver 404 si no existen pacientes que cumplen el filtro', async () => {
    const res = await request(app).delete('/patients?status=temporary leave');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual('Nothing to delete with this criteria');
  });

  test('Debe devolver un 400 si se intenta llamar sin filtros', async () => {
    const res = await request(app).delete('/patients');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('DANGER: A filter must be provided');
  });

  test('Debe devolver un 400 si se quiere filtrar por un parametros invalido', async () => {
    const res = await request(app).delete('/patients?name=Pepe');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('DANGER: A filter must be provided');
  });

  test('Debe devolver 500 si la base de datos falla al buscar', async () => {
    const spy = vi
      .spyOn(Patient, 'deleteMany')
      .mockRejectedValueOnce(new Error('Database error: Is down'));

    const res = await request(app).delete('/patients?status=deceased');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database error: Is down');

    spy.mockRestore();
  });
});
