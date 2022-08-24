import React from 'react';
import { render } from '@testing-library/react';
import { Resident } from '../domain/resident';
import ResidentPageTable from './ResidentPageTable';

describe('ResidentPageTable', () => {
  const resident: Resident = {
    id: '123',
    name: 'Frodo',
    email: 'frodo@bagend.com',
    phoneNumber: '0123',
  };

  test('it renders correctly', async () => {
    render(<ResidentPageTable resident={resident} />);
  });
});
