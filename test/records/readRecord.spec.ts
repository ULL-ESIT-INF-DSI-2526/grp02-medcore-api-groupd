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

import { Patient } from '../../src/models/patients/patientSchema';
import { Staff } from '../../src/models/staff/staffSchema';
import { Record } from '../../src/models/records/recordSchema';

import * as recordService from '../../src/services/record/readRecord.js';

describe('Pruebas para readRecordController', () => {
  let patientId: mongoose.Types.ObjectId;
  let doctorId: mongoose.Types.ObjectId;
  let secondPatientId: mongoose.Types.ObjectId;
  let secondDoctorId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const firstRecord = {
    regType: 'ambulatory',
    admissionReason: 'Dolor de cabeza',
    diagnosis: 'Migraña',
    medications: [],
    totalPrice: 0,
  };

  const secondRecord = {
    regType: 'admission',
    admissionReason: 'Fractura',
    diagnosis: 'Pierna rota',
    medications: [],
    totalPrice: 0,
  };

  beforeEach(async () => {
    await Record.deleteMany();

    await Patient.deleteMany();
    await Staff.deleteMany();

    const patient = await Patient.create({
      idenNumber: '12345678Z',
      name: 'Paciente Uno',
      birthDate: new Date('1990-01-01'),
      SSId: '123456789',
      gender: 'other',
      contactData: {
        address: 'Calle Uno 1',
        phoneNumber: '600123456',
        email: 'paciente1@test.com',
      },
      knownAllergies: [],
      bloodType: '0+',
      status: 'active',
    });

    const staff = await Staff.create({
      medicalLicenseNumber: 11111,
      name: 'Dr Uno',
      specialty: 'cardiología',
      professionalCategory: 'médico adjunto',
      turn: 'mañana',
      floor: 2,
      yearsOfExperience: 10,
      departmentContactData: {
        phone: '600123456',
        email: 'staff1@test.com',
      },
      state: 'activo',
    });

    const secondPatient = await Patient.create({
      idenNumber: '87654321X',
      name: 'Paciente Dos',
      birthDate: new Date('1991-02-02'),
      SSId: '987654321',
      gender: 'other',
      contactData: {
        address: 'Calle Dos 2',
        phoneNumber: '611123456',
        email: 'paciente2@test.com',
      },
      knownAllergies: [],
      bloodType: 'A+',
      status: 'active',
    });

    const secondStaff = await Staff.create({
      medicalLicenseNumber: 22222,
      name: 'Dr Dos',
      specialty: 'traumatología',
      professionalCategory: 'médico residente',
      turn: 'tarde',
      floor: 3,
      yearsOfExperience: 8,
      departmentContactData: {
        phone: '622123456',
        email: 'staff2@test.com',
      },
      state: 'activo',
    });

    patientId = patient._id;
    doctorId = staff._id;
    secondPatientId = secondPatient._id;
    secondDoctorId = secondStaff._id;

    await Record.insertMany([
      { ...firstRecord, patient: patientId, doctor: doctorId },
      { ...secondRecord, patient: secondPatientId, doctor: secondDoctorId },
    ]);
  });

  test('Debe devolver todos los registros si no se pasan filtros', async () => {
    const res = await request(app).get('/records');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Debe filtrar registros por paciente', async () => {
    const res = await request(app)
      .get('/records')
      .query({ patient: patientId.toString() });

    expect(res.status).toBe(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].patient).toBe(patientId.toString());
    expect(res.body[0].diagnosis).toBe('Migraña');
  });

  test('Debe filtrar registros por doctor', async () => {
    const res = await request(app)
      .get('/records')
      .query({ doctor: secondDoctorId.toString() });

    expect(res.status).toBe(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].doctor).toBe(secondDoctorId.toString());
    expect(res.body[0].diagnosis).toBe('Pierna rota');
  });

  test('Debe filtrar por paciente y doctor simultáneamente', async () => {
    const res = await request(app).get('/records').query({
      patient: patientId.toString(),
      doctor: doctorId.toString(),
    });

    expect(res.status).toBe(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].patient).toBe(patientId.toString());
    expect(res.body[0].doctor).toBe(doctorId.toString());
  });

  test('Debe devolver array vacío si no hay coincidencias', async () => {
    const res = await request(app).get('/records').query({
      patient: new mongoose.Types.ObjectId().toString(),
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('Debe ignorar filtros inválidos que no sean string', async () => {
    const res = await request(app)
      .get('/records')
      .query({
        patient: ['12345'],
      });

    // El controlador ignora el filtro y devuelve todos
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Debe devolver 500 si ocurre un error interno en el servicio', async () => {
    const spy = vi
      .spyOn(recordService, 'readRecord')
      .mockRejectedValueOnce(new Error('Fallo interno leyendo records'));

    const res = await request(app).get('/records');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Fallo interno leyendo records');

    spy.mockRestore();
  });

  test('Debe devolver 500 si ocurre un error desconocido', async () => {
    const spy = vi
      .spyOn(recordService, 'readRecord')
      .mockRejectedValueOnce('error raro');

    const res = await request(app).get('/records');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error reading records');

    spy.mockRestore();
  });
});
