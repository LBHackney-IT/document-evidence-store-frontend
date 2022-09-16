import React from 'react';
import { cleanup, render } from '@testing-library/react';
import ResidentPageTable from './ResidentPageTable';

describe('ResidentPageTable', () => {
  afterEach(cleanup);

  test('it renders correctly', async () => {
    const resident = {
      id: '123',
      name: 'Frodo',
      email: 'frodo@bagend.com',
      phoneNumber: '0123',
    };
    const componentTestOne = render(<ResidentPageTable resident={resident} />);
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

  for (const { testName, email, phoneNumber } of [
    {
      testName: 'displays placeholder when email or phoneNumber are empty',
      email: '',
      phoneNumber: '',
    },
    {
      testName: 'displays placeholder when email or phoneNumber are null',
      email: null,
      phoneNumber: null,
    },
  ]) {
    test(testName, () => {
      const resident = {
        id: '123',
        name: 'Frodo',
        email,
        phoneNumber,
      };
      const componentTestTwo = render(
        <ResidentPageTable resident={resident} />
      );
      expect(componentTestTwo.getByTestId('name-cell')).toHaveTextContent(
        resident.name
      );
      expect(
        componentTestTwo.getByTestId('blankNumber-cell')
      ).toBeInTheDocument();
      expect(
        componentTestTwo.getByTestId('blankNumber-cell')
      ).toHaveTextContent('-');
      expect(
        componentTestTwo.getByTestId('blankEmail-cell')
      ).toBeInTheDocument();
      expect(componentTestTwo.getByTestId('blankEmail-cell')).toHaveTextContent(
        '-'
      );
    });
  }
});
