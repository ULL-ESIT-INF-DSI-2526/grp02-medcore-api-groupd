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

import { Record } from '../../src/models/records/recordSchema';
import { Patient } from '../../src/models/patients/patientSchema';
import { Staff } from '../../src/models/staff/staffSchema';
import { Medication } from '../../src/models/medications/medicationSchema';

import * as recordService from '../../src/services/record/readRecordById.js';

describe('Pruebas para readRecordByIdController', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const validRecord = {
    regType: 'ambulatory' as const,
    admissionReason: 'Dolor abdominal',
    diagnosis: 'Gastritis',
    medicationList: [] as any[],
    totalPrice: 0,
  };

  let patientId: mongoose.Types.ObjectId;
  let doctorId: mongoose.Types.ObjectId;
  let medId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    await Record.deleteMany();
    await Patient.deleteMany();
    await Staff.deleteMany();
    await Medication.deleteMany();

    const patient = await Patient.create({
      idenNumber: '12345678Z',
      name: 'Paciente Uno',
      birthDate: new Date('1990-01-01'),
      SSId: '123456789',
      gender: 'other',
      contactData: {
        address: 'Calle 1',
        phoneNumber: '600123456',
        email: 'p1@test.com',
      },
      knownAllergies: [],
      bloodType: '0+',
      status: 'active',
    });

    const staff = await Staff.create({
      medicalLicenseNumber: 11111,
      name: 'Dr House',
      specialty: 'medicina general',
      professionalCategory: 'médico adjunto',
      turn: 'mañana',
      floor: 1,
      yearsOfExperience: 10,
      departmentContactData: { phone: '600123456', email: 'doc@test.com' },
      state: 'activo',
    });

    const med = await Medication.create({
      name: 'Paracetamol',
      activeIngredient: 'Paracetamol',
      natCode: '123456',
      pharmaForm: 'tablet',
      standardDose: { amount: 500, unit: 'mg' },
      routeofAdministration: 'oral',
      stock: 100,
      price: 7.5,
      expiration: new Date('2030-01-01'),
      contraindications: [],
    });

    patientId = patient._id;
    doctorId = staff._id;
    medId = med._id;
  });

  test('Debe devolver 200 y el record si existe', async () => {
    const createdRecord = await Record.create({
      ...validRecord,
      patient: patientId,
      doctor: doctorId,
    });

    const res = await request(app).get(`/records/${createdRecord._id}`);

    expect(res.status).toBe(200);

    expect(res.body._id).toBe(createdRecord._id.toString());

    expect(res.body.diagnosis).toBe('Gastritis');
  });

  test('Debe devolver 404 si el record no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/records/${fakeId}`);

    expect(res.status).toBe(404);

    expect(res.body.error).toBe('Record not found');
  });

  test('Debe devolver 400 si el id no es válido', async () => {
    const invalidId = 'id-invalido';

    const res = await request(app).get(`/records/${invalidId}`);

    expect(res.status).toBe(400);

    expect(res.body.error).toBe('Invalid record ID');
  });

  test('Debe devolver 500 si ocurre un error interno', async () => {
    const validId = new mongoose.Types.ObjectId();

    const spy = vi
      .spyOn(recordService, 'readRecordById')
      .mockRejectedValueOnce(new Error('Error interno leyendo record'));

    const res = await request(app).get(`/records/${validId}`);

    expect(res.status).toBe(500);

    expect(res.body.error).toBe('Error interno leyendo record');

    spy.mockRestore();
  });

  test('Debe devolver 500 si ocurre un error desconocido', async () => {
    const validId = new mongoose.Types.ObjectId();

    const spy = vi
      .spyOn(recordService, 'readRecordById')
      .mockRejectedValueOnce('error raro');

    const res = await request(app).get(`/records/${validId}`);

    expect(res.status).toBe(500);

    expect(res.body.error).toBe('Internal server error');

    spy.mockRestore();
  });

  test('Debe devolver correctamente un record con medicación', async () => {
    const createdRecord = await Record.create({
      ...validRecord,
      patient: patientId,
      doctor: doctorId,
      medicationList: [
        {
          medication: medId,
          amount: 2,
          instructions: 'Tomar cada 8h',
        },
      ],
      totalPrice: 15,
    });

    const res = await request(app).get(`/records/${createdRecord._id}`);

    expect(res.status).toBe(200);

    expect(res.body.medicationList.length).toBe(1);

    expect(res.body.totalPrice).toBe(15);
  });
});
