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

describe('Pruebas para el controlador de creación de personal', () => {
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

  medicalLicenseNumber: 1,
  name: "string",
  specialty: "cardiología",
  professionalCategory: "médico adjunto",
  turn: "mañana",
  floor: 1,
  yearsOfExperience: 1,
  departmentContactData: {
    phone: "string",
    email: "string"
  },
  state: "activo"
  };

  test('Debe guardar el miembro del personal y devolver 201', async () => {
    const res = await request(app).post('/staff').send(validStaff);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Juan Pérez');

    const staffById = await Staff.findById(res.body._id);
    expect(staffById).not.toBeNull();
  });

  test('Debe devolver 409 si el número de licencia médica está duplicado', async () => {
    await request(app).post('/staff').send(validStaff);
    const res = await request(app).post('/staff').send(validStaff);

    expect(res.status).toBe(409);
    expect(res.body.error).toEqual('The staff member is already at our system');
  });

  test('Debe devolver 400 si se le pasa un objeto mal formado (falta medicalLicenseNumber)', async () => {
    const incompleteStaff = {
      name: 'Juan Pérez',
      birthDate: '1990-05-15',
      SSId: '123456789012',
      gender: 'male',
      bloodType: 'A+',
      contactData: {
        address: 'Calle Falsa',
        phoneNumber: '600123456',
        email: 'juan@test.com',
      },
    };

    const res = await request(app).post('/staff').send(incompleteStaff);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      'Staff validation failed: medicalLicenseNumber: Path `medicalLicenseNumber` is required.',
    );
  });

  test('Debe devolver 400 si falta el nombre', async () => {
    const incompleteStaff = {
      medicalLicenseNumber: 123456,
      birthDate: '1990-05-15',
      SSId: '123456789012',
      gender: 'male',
      bloodType: 'A+',
      contactData: {
        address: 'Calle Falsa',
        phoneNumber: '600123456',
        email: 'juan@test.com',
      },
    };

    const res = await request(app).post('/staff').send(incompleteStaff);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      'Staff validation failed: name: Path `name` is required.',
    );
  });

  test('Debe devolver 400 si falta un campo anidado obligatorio (contactData.email)', async () => {
    const incompleteStaff = {
      medicalLicenseNumber: 123456,
      name: 'Juan Pérez',
      birthDate: '1990-05-15',
      SSId: '123456789012',
      gender: 'male',
      bloodType: 'A+',
      contactData: {
        address: 'Calle Falsa',
        phoneNumber: '600123456',
      },
    };

    const res = await request(app).post('/staff').send(incompleteStaff);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      'Staff validation failed: contactData.email: Path `contactData.email` is required.',
    );
  });

  test('Debe devolver 500 si ocurre un error interno catastrófico en el servidor', async () => {
    const spy = vi
      .spyOn(Staff.prototype, 'save')
      .mockRejectedValueOnce(new Error('Fallo crítico de hardware'));

    const res = await request(app).post('/staff').send(validStaff);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Fallo crítico de hardware');

    spy.mockRestore();
  });

      name: 'Juan Pérez',
      birthDate: '1990-05-15',
      SSId: '123456789012',
      gender: 'male',
      bloodType: 'A+',
      contactData: {
        address: 'Calle Falsa',
        phoneNumber: '600123456',
      },
    };

    const res = await request(app).post('/patients').send(incompletePatient);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      'Patient validation failed: contactData.email: Path `contactData.email` is required.',
    );
  });

  test('Debe devolver 500 si ocurre un error interno catastrófico en el servidor', async () => {
    const spy = vi
      .spyOn(Patient.prototype, 'save')
      .mockRejectedValueOnce(new Error('Fallo crítico de hardware'));

    const res = await request(app).post('/patients').send(validPatient);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Fallo crítico de hardware');

    spy.mockRestore();
  });

  describe('Validaciones personalizadas', () => {
    test('Debe devolver 400 si un campo no pasa la validación personalizada (email inválido)', async () => {
      const invalidPatient = {
        idenNumber: '12345678Z',
        name: 'Juan Pérez',
        birthDate: '1990-05-15',
        SSId: '123456789012',
        gender: 'male',
        bloodType: 'A+',
        contactData: {
          address: 'Calle Falsa',
          phoneNumber: '600123456',
          email: 'correo-no-valido',
        },
      };

      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual(
        'Patient validation failed: contactData.email: La dirección de correo no es valida',
      );
    });
    test('Debe devolver 400 si el DNI/NIE tiene un formato inválido', async () => {
      const invalidPatient = { ...validPatient, idenNumber: '12345' };
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El documento introcudido no es un documento valido (DNI o NIE)',
      );
    });

    test('Debe devolver 400 si el nombre contiene números o caracteres extraños', async () => {
      const invalidPatient = { ...validPatient, name: 'Juan P3rez!' };
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('El nombre solo puede contener letras');
    });

    test('Debe permitir un nombre con apóstrofes y guiones (debe devolver 201)', async () => {
      const validPatientWithSpecialName = {
        ...validPatient,
        name: "Jean-Claude O'Connor",
        idenNumber: '87654321X',
        SSId: '987654321012',
      };
      const res = await request(app)
        .post('/patients')
        .send(validPatientWithSpecialName);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Jean-Claude O'Connor");
    });

    test('Debe devolver 400 si el número de la Seguridad Social (SSId) contiene letras', async () => {
      const invalidPatient = { ...validPatient, SSId: '12345ABCD012' };
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El número de la Seguridad Social solo puede contener números',
      );
    });

    test('Debe devolver 400 si el teléfono de contacto no es válido en España', async () => {
      const invalidPatient = {
        ...validPatient,
        contactData: { ...validPatient.contactData, phoneNumber: '123' }, // Teléfono corto
      };
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El número de telefono proporcionado no es correcto',
      );
    });

    test('Debe devolver 400 si el grupo sanguíneo no está en el enum permitido', async () => {
      const invalidPatient = { ...validPatient, bloodType: 'C+' }; // C+ no existe
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'is not a valid enum value for path `bloodType`',
      );
    });

    test('Debe devolver 400 si la fecha de la última visita es en el futuro', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const invalidPatient = { ...validPatient, lastVisit: tomorrow };
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'La fecha de la última visita no puede ser una fecha en el futuro',
      );
    });

    test('Debe devolver 400 si se envía un contacto de emergencia pero con un teléfono inválido', async () => {
      const invalidPatient = {
        ...validPatient,
        emergencyContact: {
          name: 'Ana Pérez',
          relationship: 'parent',
          phoneNumber: '123',
        },
      };
      const res = await request(app).post('/patients').send(invalidPatient);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain(
        'El número de telefono proporcionado no es correcto',
      );
    });
  });
});