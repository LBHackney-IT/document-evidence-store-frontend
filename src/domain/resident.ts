export interface IResident {
  name: string;
  email: string | null;
  phoneNumber: string | null;
  id: string;
  referenceId?: string;
}

export class Resident implements IResident {
  name: string;
  email: string | null;
  phoneNumber: string | null;
  id: string;
  referenceId?: string;

  constructor(params: IResident) {
    this.name = params.name;
    this.email = params.email;
    this.phoneNumber = params.phoneNumber;
    this.id = params.id;
    this.referenceId = params.referenceId;
  }
}


