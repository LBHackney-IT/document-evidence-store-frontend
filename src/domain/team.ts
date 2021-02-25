import { Reason } from './reason';

export interface ITeam {
  name: string;
  googleGroup: string;
  id: string;
  reasons: Reason[];
}

export class Team implements ITeam {
  name: string;
  googleGroup: string;
  id: string;
  reasons: Reason[];

  constructor(params: ITeam) {
    this.name = params.name;
    this.googleGroup = params.googleGroup;
    this.id = params.id;
    this.reasons = params.reasons;
  }
}
