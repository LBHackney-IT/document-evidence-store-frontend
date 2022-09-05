import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Resident } from '../domain/resident';
import ResidentDetailsTable from './ResidentDetailsTable';

describe('ResidentDetailsTable', () => {
  afterEach(cleanup);
  const resident: Resident = {
    id: '123',
    name: 'Frodo',
    email: 'frodo@bagend.com',
    phoneNumber: '0123',
  };

  const residentTwo: Resident = {
    id: '124',
    name: 'Fred',
    email: '',
    phoneNumber: '',
  };

  test('it renders correctly', async () => {
    const componentTestOne = render(
      <ResidentDetailsTable resident={resident} />
    );
    expect(componentTestOne.getByTestId('name-cell')).toHaveTextContent(
      'Frodo'
    );
    expect(componentTestOne.getByTestId('email-cell')).toHaveTextContent(
      'frodo@bagend.com'
    );
    expect(componentTestOne.getByTestId('number-cell')).toHaveTextContent(
      '0123'
    );
  });

  test("displays '-' as value if either email or mobile is missing", () => {
    const componentTestTwo = render(
      <ResidentDetailsTable resident={residentTwo} />
    );
    expect(componentTestTwo.getByTestId('name-cell')).toHaveTextContent('Fred');
    expect(
      componentTestTwo.getByTestId('blankNumber-cell')
    ).toBeInTheDocument();
    expect(componentTestTwo.getByTestId('blankNumber-cell')).toHaveTextContent(
      '-'
    );
    expect(componentTestTwo.getByTestId('blankEmail-cell')).toBeInTheDocument();
    expect(componentTestTwo.getByTestId('blankEmail-cell')).toHaveTextContent(
      '-'
    );
  });
});
