import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';

import { Record } from '../../src/models/records/recordSchema';
import { Patient } from '../../src/models/patients/patientSchema';
import { Staff } from '../../src/models/staff/staffSchema';
import { Medication } from '../../src/models/medications/medicationSchema';

describe('Pruebas para el controlador de modifyRecord', () => {
  let patientId: mongoose.Types.ObjectId;
  let doctorId: mongoose.Types.ObjectId;
  let medIdA: mongoose.Types.ObjectId;
  let medIdB: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Record.deleteMany();
    await Patient.deleteMany();
    await Staff.deleteMany();
    await Medication.deleteMany();

    const patient = await Patient.create({
      idenNumber: '12345678Z',
      name: 'Paciente Test',
      SSId: '123456789',
      birthDate: new Date('1990-01-01'),
      gender: 'male',
      contactData: { address: 'Calle 1', phoneNumber: '600123456', email: 't@t.com' },
      bloodType: 'A+',
      status: 'active',
    });

    const staff = await Staff.create({
      medicalLicenseNumber: 55555,
      name: 'Dr Test',
      specialty: 'medicina general',
      professionalCategory: 'médico adjunto',
      turn: 'mañana',
      floor: 1,
      yearsOfExperience: 5,
      departmentContactData: { phone: '600123456', email: 'd@d.com' },
      state: 'activo',
    });

    const medA = await Medication.create({
      name: 'Medicamento Viejo',
      natCode: '111111',
      activeIngredient: 'first',
      pharmaForm: 'tablet',
      standardDose: { amount: 500, unit: 'mg' },
      routeofAdministration: 'oral',
      stock: 10,
      price: 5.0,
      expiration: new Date('2030-01-01'),
    });

    const medB = await Medication.create({
      name: 'Medicamento Nuevo',
      natCode: '222222',
      activeIngredient: 'second',
      pharmaForm: 'tablet',
      standardDose: { amount: 500, unit: 'mg' },
      routeofAdministration: 'oral',
      stock: 20,
      price: 10.0,
      expiration: new Date('2030-01-01'),
    });

    patientId = patient._id;
    doctorId = staff._id;
    medIdA = medA._id;
    medIdB = medB._id;
  });

  test('Debe modificar el registro, restaurar stock viejo y descontar nuevo', async () => {
    const record = await Record.create({
      patient: patientId,
      doctor: doctorId,
      regType: 'ambulatory',
      admissionReason: 'Consulta inicial',
      diagnosis: 'Leve',
      medicationList: [{ medication: medIdA, amount: 2, instructions: 'h8' }],
      totalPrice: 10.0
    });

    // Resta manual del stock al estar prescindiendo del controlador(createRecord)
    await Medication.findByIdAndUpdate(medIdA, { $inc: { stock: -2 } });
    const updateBody = {
      admissionReason: 'Consulta revisada',
      medications: [
        { natCode: '222222', amount: 1, instructions: 'Cada 24h' }
      ]
    };

    const res = await request(app)
      .patch(`/records/${record._id}`)
      .send(updateBody);

    expect(res.status).toBe(200);
    expect(res.body.admissionReason).toBe('Consulta revisada');
    expect(res.body.totalPrice).toBe(10.0);

    const medAInDb = await Medication.findById(medIdA);
    expect(medAInDb?.stock).toBe(10);

    const medBInDb = await Medication.findById(medIdB);
    expect(medBInDb?.stock).toBe(19);
  });

  test('Debe devolver 400 si la nueva medicación no tiene stock suficiente', async () => {
    const record = await Record.create({
      patient: patientId,
      doctor: doctorId,
      regType: 'ambulatory',
      admissionReason: 'Fiebre',
      diagnosis: 'Gripe',
      medicationList: [],
      totalPrice: 0
    });

    const updateBody = {
      medications: [{ natCode: '222222', amount: 500, instructions: 'Mucho' }]
    };

    const res = await request(app)
      .patch(`/records/${record._id}`)
      .send(updateBody);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Stock insuficiente para el medicamento con codigo 222222');
  });

  test('Debe actualizar campos simples sin tocar la medicación si no se envía', async () => {
    const record = await Record.create({
      patient: patientId,
      doctor: doctorId,
      regType: 'ambulatory',
      admissionReason: 'Original',
      diagnosis: 'Original',
      medicationList: [{ medication: medIdA, amount: 1, instructions: 'i' }],
      totalPrice: 5.0
    });

    const res = await request(app)
      .patch(`/records/${record._id}`)
      .send({ diagnosis: 'Actualizado' });

    expect(res.status).toBe(200);
    expect(res.body.diagnosis).toBe('Actualizado');
    expect(res.body.medicationList).toHaveLength(1);

    const medAInDb = await Medication.findById(medIdA);
    expect(medAInDb?.stock).toBe(10); 
  });

  test('Debe devolver 404 si el registro a modificar no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/records/${fakeId}`)
      .send({ diagnosis: 'Test' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Registro no encontrado');
  });

  test('Debe devolver 400 si el ID es inválido', async () => {
    const res = await request(app)
      .patch('/records/invalid-id')
      .send({ diagnosis: 'Test' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ID de registro no valido');
  });
});