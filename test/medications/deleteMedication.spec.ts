import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para comprobar el funcionamiento del controlador deleteMedicationbyId', () => {
  const med1 = {
    name: 'Rivotril',
    activeIngredient: 'clonazepam',
    natCode: '000000',
    pharmaForm: 'tablet' as const,
    standardDose: {
      amount: 500,
      unit: 'mg' as const,
    },
    routeofAdministration: 'oral' as const,
    stock: 70,
    price: 9.99,
    prescription: false,
    expiration: new Date('2026-06-06'),
  };

  const med2 = {
    name: 'Ibuprofeno',
    activeIngredient: 'Ibuprofeno',
    natCode: '000002',
    pharmaForm: 'tablet' as const,
    standardDose: {
      amount: 600,
      unit: 'mg' as const,
    },
    routeofAdministration: 'oral' as const,
    stock: 100,
    price: 8.99,
    prescription: false,
    expiration: new Date('2026-06-12'),
  };

  beforeAll(async () => {
    await connectDB();
    await Medication.deleteMany();
  });

  beforeEach(async () => {
    await Medication.deleteMany();
    await Medication.create([med1, med2]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe eliminar medicaciones que cumplan la query', async () => {
    const res = await request(app).delete('/medications?name=Rivotril');

    expect(res.status).toBe(200);
    expect(res.body.deletedCount).toBe(1);

    expect((await Medication.find({ name: 'Rivotril' })).length).toBe(0);
  });

  test('Debe devolver un 400 si se intenta llamar sin filtros', async () => {
    const res = await request(app).delete('/medications');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('A filter must be provided');
  });

  test('Debe devolver 404 si no existen medicaciones que cumplan la query', async () => {
    const res = await request(app).delete('/medications?ingredient=abc');

    expect(res.body.error).toEqual('Medications were not found');
  });
});