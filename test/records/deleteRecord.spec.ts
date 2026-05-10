import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';

import { Record } from '../../src/models/records/recordSchema';
import { Patient } from '../../src/models/patients/patientSchema';
import { Staff } from '../../src/models/staff/staffSchema';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para el controlador de deleteRecord', () => {
  let patientId: mongoose.Types.ObjectId;
  let doctorId: mongoose.Types.ObjectId;
  let medId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpieza de colecciones
    await Record.deleteMany();
    await Patient.deleteMany();
    await Staff.deleteMany();
    await Medication.deleteMany();

    // Crear datos base para asociar al registro
    const patient = await Patient.create({
      idenNumber: '12345678Z',
      name: 'Paciente Test',
      birthDate: new Date('1990-01-01'),
      SSId: '123456789',
      gender: 'male',
      contactData: { address: 'Calle 1', phoneNumber: '600123456', email: 'test@test.com' },
      bloodType: 'A+',
      status: 'active',
    });

    const staff = await Staff.create({
      medicalLicenseNumber: 55555,
      name: 'DrTest',
      specialty: 'medicina general',
      professionalCategory: 'médico adjunto',
      turn: 'mañana',
      floor: 1,
      yearsOfExperience: 5,
      departmentContactData: { phone: '600123456', email: 'doc@test.com' },
      state: 'activo',
    });

    const med = await Medication.create({
      name: 'Amoxicilina',
      activeIngredient: 'Amoxicilina',
      natCode: '999999',
      pharmaForm: 'tablet',
      standardDose: { amount: 500, unit: 'mg' },
      routeofAdministration: 'oral',
      stock: 10, // Stock inicial bajo para notar la restauración
      price: 10.0,
      expiration: new Date('2030-01-01'),
      contraindications: [],
    });

    patientId = patient._id;
    doctorId = staff._id;
    medId = med._id;
  });

  test('Debe eliminar el registro y devolver el stock al medicamento', async () => {
    const record = await Record.create({
      patient: patientId,
      doctor: doctorId,
      regType: 'ambulatory',
      admissionReason: 'Infección',
      diagnosis: 'Otitis',
      medicationList: [
        {
          medication: medId,
          amount: 5,
          instructions: '1 cada 12h'
        }
      ],
      totalPrice: 50
    });

    const medBefore = await Medication.findById(medId);
    expect(medBefore?.stock).toBe(10);

    const res = await request(app).delete(`/records/${record._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('correctamente');

    const recordInDb = await Record.findById(record._id);
    expect(recordInDb).toBeNull();

    const medAfter = await Medication.findById(medId);
    expect(medAfter?.stock).toBe(15);
  });

  test('Debe devolver 404 si el registro no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/records/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Registro médico no encontrado');
  });

  test('Debe devolver 400 si el ID proporcionado no es válido para MongoDB', async () => {
    const res = await request(app).delete('/records/id-no-valido');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ID de registro no válido');
  });

  test('Debe funcionar correctamente si el registro no tiene medicamentos', async () => {
    const recordSinMeds = await Record.create({
      patient: patientId,
      doctor: doctorId,
      regType: 'ambulatory',
      admissionReason: 'Chequeo',
      diagnosis: 'Sano',
      medicationList: [],
      totalPrice: 0
    });

    const res = await request(app).delete(`/records/${recordSinMeds._id}`);

    expect(res.status).toBe(200);
    const recordInDb = await Record.findById(recordSinMeds._id);
    expect(recordInDb).toBeNull();
  });
});