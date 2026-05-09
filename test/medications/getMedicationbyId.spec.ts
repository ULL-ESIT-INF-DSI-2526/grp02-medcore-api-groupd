import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para comprobar el funcionamiento del controlador getMedicationbyId', () => {
  const medicacionValida = {
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

  beforeAll(async () => {
    await connectDB();
    await Medication.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe devolver medicacion a partir del id', async () => {
    const create = await Medication.create(medicacionValida);
    const res = await request(app).get(`/medications/${create._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(create._id.toString());
  });
});