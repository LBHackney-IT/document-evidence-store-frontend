import { Service } from './service';

export interface IServiceArea {
  name: string;
  googleGroup: string;
  services: Service[];
}

export class ServiceArea implements IServiceArea {
  name: string;
  googleGroup: string;
  services: Service[];

  constructor(params: IServiceArea) {
    this.name = params.name;
    this.googleGroup = params.googleGroup;
    this.services = params.services;
  }
}
