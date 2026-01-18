export interface Product {
  id?: number
  codice: string
  nome: string
  descrizione?: string
  prezzo: number
  quantita: number
}

export interface User {
  id: number
  username: string
  password?: string
}

// Interfaccia per estendere la Request di Express
import { Request } from 'express'
export interface AuthRequest extends Request {
  user?: User
}
