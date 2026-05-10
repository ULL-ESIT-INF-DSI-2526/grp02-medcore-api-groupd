import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';

import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';

import { Staff } from '../../src/models/staff/staffSchema';

import * as staffService from '../../src/services/staff/modifyStaff.js';

describe('Pruebas para modifyStaffController', () => {

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Staff.deleteMany();
  });

  const validStaff = {
    medicalLicenseNumber: 12345,
    name: 'Dr Test',
    specialty: 'cardiología' as const,
    professionalCategory: 'médico adjunto' as const,
    turn: 'mañana' as const,
    floor: 2,
    yearsOfExperience: 10,
    departmentContactData: {
      phone: '600123456',
      email: 'staff@test.com',
    },
    state: 'activo' as const,
  };

  test('Debe modificar un staff buscándolo por nombre', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        yearsOfExperience: 20,
      });

    expect(res.status).toBe(200);

    const updatedStaff = await Staff.findOne({
      name: 'Dr Test',
    });

    expect(updatedStaff?.yearsOfExperience).toBe(20);
  });

  test('Debe modificar un staff buscándolo por especialidad', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ specialty: 'cardiología' })
      .send({
        floor: 5,
      });

    expect(res.status).toBe(200);

    const updatedStaff = await Staff.findOne({
      specialty: 'cardiología',
    });

    expect(updatedStaff?.floor).toBe(5);
  });

  test('Debe modificar varios campos a la vez', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        floor: 7,
        state: 'inactivo',
        yearsOfExperience: 30,
      });

    expect(res.status).toBe(200);

    const updatedStaff = await Staff.findOne({
      name: 'Dr Test',
    });

    expect(updatedStaff?.floor).toBe(7);
    expect(updatedStaff?.state).toBe('inactivo');
    expect(updatedStaff?.yearsOfExperience).toBe(30);
  });

  test('Debe devolver 400 si no se proporciona ningún filtro', async () => {
    const res = await request(app)
      .patch('/staff')
      .send({
        floor: 4,
      });

    expect(res.status).toBe(400);

    expect(res.body.error).toBe(
      'No valid filter provided',
    );
  });

  test('Debe devolver 404 si el staff no existe', async () => {
    const res = await request(app)
      .patch('/staff')
      .query({ name: 'No Existe' })
      .send({
        floor: 9,
      });

    expect(res.status).toBe(404);

    expect(res.body.error).toBe(
      'Staff not found',
    );
  });

  test('Debe devolver 400 si el enum specialty es inválido', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        specialty: 'informatica',
      });

    expect(res.status).toBe(400);

    expect(res.body.error).toContain(
      'is not a valid enum value',
    );
  });

  test('Debe devolver 400 si yearsOfExperience tiene tipo inválido', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        yearsOfExperience: 'muchos',
      });

    expect(res.status).toBe(400);
  });

  test('Debe devolver 400 si floor tiene tipo inválido', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        floor: 'segunda planta',
      });

    expect(res.status).toBe(400);
  });

  test('Debe devolver 400 si el email es inválido', async () => {
    await Staff.create(validStaff);

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        departmentContactData: {
          phone: '600123456',
          email: 'correo-mal-formado',
        },
      });

    expect(res.status).toBe(400);
  });

  test('Debe ignorar query params inválidos y devolver 400', async () => {
    const res = await request(app)
      .patch('/staff')
      .query({
        floor: 2,
      })
      .send({
        state: 'inactivo',
      });

    expect(res.status).toBe(400);

    expect(res.body.error).toBe(
      'No valid filter provided',
    );
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const spy = vi
      .spyOn(staffService, 'modifyStaff')
      .mockRejectedValueOnce(
        new Error('Fallo interno'),
      );

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        floor: 10,
      });

    expect(res.status).toBe(500);

    expect(res.body.error).toBe(
      'Fallo interno',
    );

    spy.mockRestore();
  });

  test('Debe devolver 500 si ocurre un error desconocido', async () => {
    const spy = vi
      .spyOn(staffService, 'modifyStaff')
      .mockRejectedValueOnce('error raro');

    const res = await request(app)
      .patch('/staff')
      .query({ name: 'Dr Test' })
      .send({
        floor: 10,
      });

    expect(res.status).toBe(500);

    expect(res.body.error).toBe(
      'Internal Server Error',
    );

    spy.mockRestore();
  });

});