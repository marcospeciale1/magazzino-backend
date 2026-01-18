export interface Product {
  id?: string;
  codice: string;
  nome: string;
  descrizione?: string;
  prezzo: number;
  quantita: number;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: any[];
}
