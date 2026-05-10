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

  const med1 = {
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

  const med_incompleta = {
    name: 'Rivotril',
    activeIngredient: 'clonazepam',
    natCode: '000000',
    pharmaForm: 'tablet',
  }

  test('Debe guardar el medicamento y devolver 201', async () => {
    const res = await request(app).post('/medications').send(med1);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Rivotril');
  });

  test('Debe validar los atributos', async () => {
    med1.natCode = '00000a'
    const res = await request(app).post('/medications').send(med1);
    expect(res.status).toBe(400);
  });

  test('Debe rechazar datos incompletos', async () => {
    const res = await request(app).post('/medications').send(med_incompleta);
    expect(res.status).toBe(400);
  });
});