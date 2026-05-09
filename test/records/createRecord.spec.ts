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

describe('Pruebas para el controlador de createRecord', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const mockPatientActive = {
    idenNumber: '12345678Z',
    name: 'Juan Pérez',
    birthDate: '1990-05-15',
    SSId: '123456789012',
    gender: 'male',
    bloodType: 'A+',
    contactData: {
      address: 'Calle 1',
      phoneNumber: '600123456',
      email: 'juan@test.com',
    },
    status: 'active',
  };

  const mockPatientDeceased = {
    ...mockPatientActive,
    idenNumber: '87654321X',
    name: 'Pedro Fallecido',
    SSId: '987654321012',
    status: 'deceased',
  };

  const mockDoctorActive = {
    medicalLicenseNumber: 11111,
    name: 'Dr. House',
    specialty: 'medicina general',
    professionalCategory: 'médico adjunto',
    turn: 'mañana',
    floor: 1,
    yearsOfExperience: 10,
    state: 'activo',
  };

  const mockDoctorInactive = {
    ...mockDoctorActive,
    medicalLicenseNumber: 22222,
    name: 'Dr. Nick',
    state: 'inactivo',
  };

  const mockValidMed = {
    name: 'Paracetamol',
    activeIngredient: 'Paracetamol',
    natCode: '111111',
    pharmaForm: 'tablet',
    standardDose: { amount: 500, unit: 'mg' },
    routeofAdministration: 'oral',
    stock: 50,
    price: 2.5,
    expiration: new Date('2030-01-01'),
    contraindications: [],
  };

  const mockExpiredMed = {
    ...mockValidMed,
    name: 'Ibuprofeno Caducado',
    natCode: '222222',
    expiration: new Date('2020-01-01'),
  };

  const validRecordBody = {
    idenNumber: '12345678Z',
    medicalLicenseNumber: 11111,
    regType: 'ambulatory',
    admissionReason: 'Fiebre alta',
    diagnosis: 'Gripe común',
    medications: [
      {
        natCode: '111111',
        amount: 2,
        instructions: '1 pastilla cada 8 horas',
      },
    ],
  };

  beforeEach(async () => {
    await Record.deleteMany();
    await Patient.deleteMany();
    await Staff.deleteMany();
    await Medication.deleteMany();

    await Patient.insertMany([mockPatientActive, mockPatientDeceased]);
    await Staff.insertMany([mockDoctorActive, mockDoctorInactive]);
    await Medication.insertMany([mockValidMed, mockExpiredMed]);
  });

  test('Debe crear el registro, calcular el total y restar el stock en base de datos', async () => {
    const res = await request(app).post('/records').send(validRecordBody);

    expect(res.status).toBe(201);
    expect(res.body.admissionReason).toBe('Fiebre alta');
    expect(res.body.totalPrice).toBe(5); // 2 unidades * 2.50€

    // Validamos el guardado del stock (de 50 a 48)
    const medInDb = await Medication.findOne({ natCode: '111111' });
    expect(medInDb?.stock).toBe(48);
  });

  test('Debe crear el registro correctamente si no hay medicación', async () => {
    const bodySinMeds = { ...validRecordBody, medications: [] };
    const res = await request(app).post('/records').send(bodySinMeds);

    expect(res.status).toBe(201);
    expect(res.body.totalPrice).toBe(0);
    expect(res.body.medicationList).toHaveLength(0);
  });

  test('Debe devolver 404 si el paciente no existe', async () => {
    const body = { ...validRecordBody, idenNumber: '99999999Z' };
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe(
      'El paciente con identificación 99999999Z no existe en la base de datos.',
    );
  });

  test('Debe devolver 400 si el paciente está fallecido', async () => {
    const body = { ...validRecordBody, idenNumber: '87654321X' }; // DNI de Pedro Fallecido
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      'El paciente con identificación 87654321X está fallecido',
    );
  });

  test('Debe devolver 404 si el médico no existe', async () => {
    const body = { ...validRecordBody, medicalLicenseNumber: 99999 };
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe(
      'El médico con número 99999 no existe en la base de datos',
    );
  });

  test('Debe devolver 400 si el médico está inactivo', async () => {
    const body = { ...validRecordBody, medicalLicenseNumber: 22222 }; // ID de Dr. Nick
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      'El médico con número 22222 no se encuentra activo',
    );
  });

  test('Debe devolver 404 si el medicamento no existe', async () => {
    const body = {
      ...validRecordBody,
      medications: [{ natCode: '000000', amount: 1, instructions: 'Tomar' }],
    };
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Medication not found: 000000');
  });

  test('Debe devolver 400 si el medicamento está caducado', async () => {
    const body = {
      ...validRecordBody,
      medications: [{ natCode: '222222', amount: 1, instructions: 'Tomar' }],
    };
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Medication expired: 222222');
  });

  test('Debe devolver 400 si no hay stock suficiente (y no restar nada de la BD)', async () => {
    const body = {
      ...validRecordBody,
      medications: [{ natCode: '111111', amount: 100, instructions: 'Tomar' }], // Pedimos 100, hay 50
    };
    const res = await request(app).post('/records').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Insufficient stock for medication: 111111');

    // Validamos que el stock no se ha tocado gracias a la fase 1 de guardado
    const medInDb = await Medication.findOne({ natCode: '111111' });
    expect(medInDb?.stock).toBe(50);
  });

  test('Debe devolver 400 si falta un campo obligatorio del Record', async () => {
    const { admissionReason, ...bodySinReason } = validRecordBody;
    const res = await request(app).post('/records').send(bodySinReason);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Record validation failed');
    expect(res.body.error).toContain('admissionReason');
  });

  test('Debe devolver 500 si ocurre un fallo catastrófico en la base de datos', async () => {
    const spy = vi
      .spyOn(Record, 'create')
      .mockRejectedValueOnce(new Error('Fallo crítico de base de datos'));

    const res = await request(app).post('/records').send(validRecordBody);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Fallo crítico de base de datos');

    spy.mockRestore();
  });
});
