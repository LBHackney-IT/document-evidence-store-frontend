import { ServiceArea } from '../domain/service-area';
import { User } from '../domain/user';

export class ServiceAreaHelper {
  public filterServiceAreasForUser(
    serviceAreaJson: ServiceArea[],
    user: User
  ): ServiceArea[] {
    return serviceAreaJson.filter((serviceArea) =>
      user.groups.includes(serviceArea.googleGroup)
    );
  }
}
