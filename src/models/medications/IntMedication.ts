import { intDose } from "./intDose.js"
import { PharmaForm, RouteofAdministration } from "./types.js"

export interface IntMedication {
  name: string,
  activeIngredient: string,
  natCode: number,
  pharmaForm: PharmaForm,
  standardDose: intDose,
  routeofAdministration: RouteofAdministration,
  stock: number,
  price: number,
  presctiption: boolean,
  expiration: Date,
  contraindications: string[]
}