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

describe('Medication Controller - Read by Query', () => {
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

  test('Debe devolver una lista vacia si no coincide', async () => {
    const res = await request(app).get(`/medications?name=a`);
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual('Search query did not match any medication');
  });

  test('Busqueda correcta', async () => {
    await request(app).post('/medications').send(medicacionValida);
    const res = await request(app).get(`/medications?name=Rivo`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].natCode).toBe('000000');
  });
});