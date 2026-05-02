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
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para el controlador de creación de medicamentos', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Medication.deleteMany();
  });

  const medicacionValida = {
    name: 'Rivotril',
    activeIngredient: 'clonazepam',
    natCode: '000000',
    pharmaForm: 'tablet',
    standardDose: {
      amount: 500,
      unit: 'mg',
    },
    routeofAdministration: 'oral',
    stock: 70,
    price: 9.99,
    prescription: false,
    expiration: '2026-06-06',
  };

  test('Debe guardar el medicamento y devolver 201', async () => {
    const res = await request(app).post('/medications').send(medicacionValida);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Rivotril');
  });
  test('Debe guardar validar los atributos', async () => {
    medicacionValida.natCode = '00000a'
    const res = await request(app).post('/medications').send(medicacionValida);

    expect(res.status).toBe(400);
  });
});