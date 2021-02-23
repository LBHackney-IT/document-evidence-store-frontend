import { User } from '../domain/user';
import { ServiceAreaHelper } from './service-area-helper';
import { ServiceArea } from '../domain/service-area';

const jwtPayload = {
  groups: ['service-area', 'another-service-area'],
  name: 'frodo',
  email: 'frodo@bag.end',
} as User;

describe('Service Area Helper', () => {
  let instance: ServiceAreaHelper;
  let result: ServiceArea[];

  beforeEach(() => {
    instance = new ServiceAreaHelper();
  });

  it('when the user is a member of all service area groups', () => {
    const serviceAreaJson: ServiceArea[] = [
      {
        name: 'Service Area 1',
        googleGroup: 'service-area',
        services: [],
      },
      {
        name: 'Service Area 2',
        googleGroup: 'another-service-area',
        services: [],
      },
    ];

    result = instance.filterServiceAreasForUser(serviceAreaJson, jwtPayload);
    expect(result).toHaveLength(2);
  });

  it('when the user is a member of one service area groups', () => {
    const serviceAreaJson: ServiceArea[] = [
      {
        name: 'Service Area 1',
        googleGroup: 'service-area',
        services: [],
      },
      {
        name: 'Service Area 2',
        googleGroup: 'different-service-area',
        services: [],
      },
    ];

    result = instance.filterServiceAreasForUser(serviceAreaJson, jwtPayload);
    expect(result).toHaveLength(1);
    expect(result[0].googleGroup).toBe('service-area');
  });

  it('when the user is a member of no service area groups', () => {
    const serviceAreaJson: ServiceArea[] = [
      {
        name: 'Service Area 1',
        googleGroup: 'different-service-area-one',
        services: [],
      },
      {
        name: 'Service Area 2',
        googleGroup: 'different-service-area-two',
        services: [],
      },
    ];

    result = instance.filterServiceAreasForUser(serviceAreaJson, jwtPayload);
    expect(result).toHaveLength(0);
  });
});
