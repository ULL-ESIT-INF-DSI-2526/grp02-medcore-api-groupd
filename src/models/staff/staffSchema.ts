import {Schema, model} from 'mongoose';
import Staff from './staffInterface.js';

const StaffSchema = new Schema<Staff>({
    medicalLicenseNumber: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    specialty: {type: String, enum: ["medicina general", "cardiología", "traumatología", "pediatría", "oncología", "urgencias"], required: true},
    professionalCategory: {type: String, enum: ["médico adjunto", "médico residente", "enfermero", "auxiliar", "jefe de servicio"], required: true},
    turn: {type: String, enum: ["mañana", "tarde", "noche", "rotatorio"], required: true},
    floor: {type: Number, required: true},
    yearsOfExperience: {type: Number, required: true},
    departmentContactData: {
        phone: {type: String, required: false},
        email: {type: String, required: false}
    },
    state: {type: String, enum: ["activo", "inactivo"], required: true}
});

export default model<Staff>('Staff', StaffSchema);