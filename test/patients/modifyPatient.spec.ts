import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectDB } from '../../src/db/mongoose';
import { Patient } from '../../src/models/patients/patientSchema';

describe('Pruebas para comprobar el funcionamiento del controlador modifyPatient', () => {
  const paciente1 = {
    idenNumber: '12345678Z',
    name: 'Juan Pérez',
    birthDate: '1990-05-15T00:00:00.000Z',
    SSId: '123456789012',
    gender: 'male' as const,
    bloodType: 'A+' as const,
    contactData: {
      address: 'Calle Falsa',
      phoneNumber: '600123456',
      email: 'juan@test.com',
    },
  };

  const paciente2 = {
    idenNumber: '48210567Z',
    name: 'Juanma García',
    birthDate: '1985-10-20',
    SSId: '222222222222',
    gender: 'male' as const,
    bloodType: 'B-' as const,
    contactData: {
      address: 'Calle 2',
      phoneNumber: '600000002',
      email: 'juan2@test.com',
    },
  };

  beforeAll(async () => {
    await connectDB();
    await Patient.deleteMany();
    await Patient.create([paciente1, paciente2]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Debe devolver la información actualizada', async () => {
    const infoToUpdate = {
      idenNumber: '53912754H',
      SSId: '333333333333',
      contactData: {
        address: 'Calle 3',
        phoneNumber: '600000003',
        email: 'ana@test.com',
      },
    };

    const resForId = await Patient.find({ idenNumber: '48210567Z' });

    expect(resForId[0].SSId).toEqual('222222222222');

    const res = await request(app)
      .patch(`/patients/${resForId[0]._id}`)
      .send(infoToUpdate);

    expect(res.status).toBe(200);
    expect(res.body.SSId).toEqual('333333333333');
  });

  test('Debe devolver el paciente sin modificar si no se especifica body en la request', async () => {
    const resForId = await Patient.find({ idenNumber: '12345678Z' });
    const res = await request(app).patch(`/patients/${resForId[0]._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(paciente1);
  });

  test('Debe devolver un error 404 si no se encuentra un paciente con el id', async () => {
    const res = await request(app).patch('/patients/69f473e840f5b1f3cd7852f7');

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(
      'Patient with id (69f473e840f5b1f3cd7852f7) not found',
    );
  });

  test('Debe devolver un error 400 si no se especifica un id valido para MongoDB', async () => {
    const res = await request(app).patch('/patients/789');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('Invalid MongoDB id format');
  });

  test('Debe devolver un error 500 si simulamos un error en el server', async () => {
    const spy = vi
      .spyOn(Patient, 'findByIdAndUpdate')
      .mockRejectedValueOnce(new Error('Database error: Is down'));

    const resForId = await Patient.find({ idenNumber: '12345678Z' });
    const res = await request(app).patch(`/patients/${resForId[0]._id}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database error: Is down');

    spy.mockRestore();
  });

  describe('Test para comrpobar que se pasan las comprobaciones', () => {
    test('Debe devolver 400 si se intenta poner un email inválido', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({
          contactData: { ...paciente!.contactData, email: 'correo-no-valido' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('La dirección de correo no es valida');
    });

    test('Debe devolver 400 si se intenta cambiar a un DNI/NIE con formato inválido', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({ idenNumber: '12345' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El documento introcudido no es un documento valido',
      );
    });

    test('Debe devolver 400 si se intenta poner un nombre con números o caracteres extraños', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({ name: 'Juan P3rez!' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('El nombre solo puede contener letras');
    });

    test('Debe permitir actualizar el nombre con apóstrofes y guiones (debe devolver 200)', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({ name: "Jean-Claude O'Connor" });

      expect(res.status).toBe(200); // En PATCH esperamos un 200 OK
      expect(res.body.name).toBe("Jean-Claude O'Connor");
    });

    test('Debe devolver 400 si se intenta poner un número de la Seguridad Social (SSId) con letras', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({ SSId: '12345ABCD012' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El número de la Seguridad Social solo puede contener números',
      );
    });

    test('Debe devolver 400 si se intenta poner un teléfono de contacto no válido en España', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({
          contactData: { ...paciente!.contactData, phoneNumber: '123' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El número de telefono proporcionado no es correcto',
      );
    });

    test('Debe devolver 400 si se intenta cambiar a un grupo sanguíneo que no está en el enum', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({ bloodType: 'C+' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'is not a valid enum value for path `bloodType`',
      );
    });

    test('Debe devolver 400 si se intenta poner la fecha de la última visita en el futuro', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({ lastVisit: tomorrow });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'La fecha de la última visita no puede ser una fecha en el futuro',
      );
    });

    test('Debe devolver 400 si se añade un contacto de emergencia pero con un teléfono inválido', async () => {
      const paciente = await Patient.findOne({ idenNumber: '12345678Z' });

      const res = await request(app)
        .patch(`/patients/${paciente!._id}`)
        .send({
          emergencyContact: {
            name: 'Ana Pérez',
            relationship: 'parent',
            phoneNumber: '123',
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El número de telefono proporcionado no es correcto',
      );
    });
  });
});
