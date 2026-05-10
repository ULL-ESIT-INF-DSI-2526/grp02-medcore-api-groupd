import { Document } from 'mongoose';

interface Staff extends Document {
    medicalLicenseNumber : number;
    name : string;
    specialty : "medicina general" | "cardiología" | "traumatología" | "pediatría" | "oncología" | "urgencias";
    professionalCategory: "médico adjunto" | "médico residente" | "enfermero" | "auxiliar" | "jefe de servicio";
    turn: "mañana" | "tarde" | "noche" | "rotatorio";
    floor: number;
    yearsOfExperience: number;
    departmentContactData : {
        phone: string;
        email: string;
    };
    state: "activo" | "inactivo";
}

export default Staff;