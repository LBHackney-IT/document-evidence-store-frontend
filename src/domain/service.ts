export interface IService {
  id: string;
  name: string;
}
export class Service implements IService {
  id: string;
  name: string;

  constructor(params: IService) {
    this.id = params.id;
    this.name = params.name;
  }
}
