interface IResident {
  name: string;
  email: string;
  phoneNumber: string;
}

export class Resident implements IResident {
  name: string;
  email: string;
  phoneNumber: string;

  constructor(params: IResident) {
    this.name = params.name;
    this.email = params.email;
    this.phoneNumber = params.phoneNumber;
  }
}
