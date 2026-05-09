import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para comprobar el funcionamiento del controlador modifyMedication', () => {
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

  test('Debe devolver la informacion actualizada', async () => {
    const infoToUpdate = {
      name: 'nombre',
      activeIngredient: 'ingrediente',
      natCode: '999999',
    };

    const resForId = await Medication.find({ name: 'Rivotril' });

    expect(resForId[0].natCode).toEqual('000000');

    const res = await request(app)
      .patch(`/medications/${resForId[0]._id}`)
      .send(infoToUpdate);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('nombre');
  });

  test('Debe devolver el medicamento sin modificar si no se especifica body en la request', async () => {
    const resForId = await Medication.find({ name: 'Ibuprofeno' });
    const res = await request(app).patch(`/medications/${resForId[0]._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(JSON.parse(JSON.stringify(med2)));
  });

  test('Debe devolver un error 404 si no se encuentra un medicamento con el id', async () => {
    const res = await request(app).patch('/medications/69f473e840f5b1f3cd7852f7');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(
      'Medication with id (69f473e840f5b1f3cd7852f7) not found',
    );
  });

  test('Debe devolver un error 400 si no se especifica un id valido para MongoDB', async () => {
    const res = await request(app).patch('/medications/789');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('Invalid MongoDB id format');
  });
});