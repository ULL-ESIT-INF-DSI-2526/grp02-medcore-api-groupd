import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Test para comprobar el funcionamiento del controlador deleteMedication', () => {
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

  test('Debe eliminar un medicamento por su id y devolver su info.', async () => {
    const resToId = await Medication.find({ name: 'Rivotril' });
    const res = await request(app).delete(`/medications/${resToId[0]._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({...med1, expiration: med1.expiration.toISOString()});
  });

  test('Debe devolver un error 404 si no se encuentra un medicamento con el id', async () => {
    const res = await request(app).delete('/medications/69f473e840f5b1f3cd7852f7');
    expect(res.status).toBe(404);
  });

  test('Debe devolver un error 400 si no se especifica un id valido para MongoDB', async () => {
    const res = await request(app).delete('/medications/789');
    expect(res.status).toBe(400);
  });

  test('Debe devolver un error 500 si simulamos un error en el server', async () => {
    const spy = vi
      .spyOn(Medication, 'findByIdAndDelete')
      .mockRejectedValueOnce(new Error('Database error: Is down'));

    const resForId = await Medication.find({ name: 'Ibuprofeno' });
    const res = await request(app).delete(`/medications/${resForId[0]._id}`);
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});