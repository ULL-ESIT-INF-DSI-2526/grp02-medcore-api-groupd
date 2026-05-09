import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para comprobar el funcionamiento del controlador modifyMedications', () => {
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
    await Medication.create([med1, med2]);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe modificar por nombre y devolver 200', async () => {
    const res = await request(app)
      .patch(`/medications`)
      .query({ name: "Rivotril" })
      .send({ stock: 25 });

    expect(res.status).toBe(200);

    const updated = await Medication.findOne({ name: "Rivotril" });
    expect(updated?.stock).toBe(25);
  });
});