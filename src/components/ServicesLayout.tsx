import React, { FunctionComponent } from 'react';
import { ServiceArea } from '../domain/service-area';
import Link from 'next/link';
import { Service } from '../domain/service';

export const ServicesLayout: FunctionComponent<Props> = ({ serviceAreas }) => {
  const ServiceAreaItem = (serviceArea: ServiceArea): JSX.Element => {
    return (
      <ul className="lbh-list lbh-body-l">
        <li key={serviceArea.googleGroup}>{serviceArea.name}</li>
        <ul className="lbh-list">
          {serviceArea.services.map((service) => (
            <ServiceItem {...service} />
          ))}
        </ul>
      </ul>
    );
  };

  const ServiceItem = (service: Service): JSX.Element => {
    return (
      <li key={service.id}>
        <Link href={`/services/${service.id}/dashboard`}>
          <a className="lbh-link">{service.name}</a>
        </Link>
      </li>
    );
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        {serviceAreas.map((serviceArea) => (
          <ServiceAreaItem {...serviceArea} />
        ))}
      </div>
    </div>
  );
};

interface Props {
  serviceAreas: Array<ServiceArea>;
}
