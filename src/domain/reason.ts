export interface IReason {
  id: string;
  name: string;
}
export class Reason implements IReason {
  id: string;
  name: string;

  constructor(params: IReason) {
    this.id = params.id;
    this.name = params.name;
  }
}
