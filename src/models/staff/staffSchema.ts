import {Schema, model} from 'mongoose';
import Staff from './staffInterface.js';

import validator from 'validator';

const StaffSchema = new Schema<Staff>({
    medicalLicenseNumber: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: (value : string) => {
                return validator.isNumeric(value);
            },
            message : "No es número válido de licencia"
        },
    },
    name: {
        type: String,
        required: true,
        validate : {
            validator: (value : string) => {
                return (validator.isAlpha(value, 'es-ES', {ignore: " -'"}) &&
                        validator.isAlpha(value.split(' ')[0], 'es-ES', {ignore: " -'"}));
            },
            message : "El nombre solo puede contener letras"
        }
    },
    specialty: {
        type: String,
        enum: ["medicina general", "cardiología", "traumatología", "pediatría", "oncología", "urgencias"],
        required: true,
        validate: {
            validator: (value : string) => {
                return validator.isIn(value, ["medicina general", "cardiología", "traumatología", "pediatría", "oncología", "urgencias"]);
            },
            message : "Especialidad no válida"
        },
    },
    professionalCategory: {
        type: String,
        enum: ["médico adjunto", "médico residente", "enfermero", "auxiliar", "jefe de servicio"],
        required: true,
        validate: {
            validator: (value : string) => {
                return validator.isIn(value, ["médico adjunto", "médico residente", "enfermero", "auxiliar", "jefe de servicio"]);
            },
            message : "Categoría profesional no válida"
        },
    },
    turn: {
        type: String,
        enum: ["mañana", "tarde", "noche", "rotatorio"],
        required: true,
        validate: {
            validator: (value : string) => {
                return validator.isIn(value, ["mañana", "tarde", "noche", "rotatorio"]);
            },
            message : "Turno no válido"
        },
    },
    floor: {
        type: Number,
        required: true,
        validate : {
            validator: (value : number) => {
                return value > 0;
            },
            message : "El número de planta debe ser un número positivo"
        }
    },
    yearsOfExperience: {
        type: Number,
        required: true,
        validate : {
            validator: (value : number) => {
                return value >= 0;
            },
            message : "Los años de experiencia no pueden ser negativos"
        },
    },
    departmentContactData: {
        phone: {type: String, required: false,
        validate: {
            validator: (value : string) => {
                return validator.isMobilePhone(value, 'es-ES');
            },
            message : "Número de teléfono no válido"
        },
        email: {type: String, required: false, validate: {
            validator: (value : string) => {
                return validator.isEmail(value);
            },
            message : "Correo electrónico no válido"
        }}},
    },
    state: {type: String, enum: ["activo", "inactivo"], required: true}
});

export const Staff = model<Staff>('Staff', StaffSchema);