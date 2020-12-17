export interface IResident {
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
}

export class Resident implements IResident {
  name: string;
  email: string;
  phoneNumber: string;
  id: string;

  constructor(params: IResident) {
    this.name = params.name;
    this.email = params.email;
    this.phoneNumber = params.phoneNumber;
    this.id = params.id;
  }
}
