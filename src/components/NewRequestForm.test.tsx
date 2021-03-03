import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import NewRequestForm from './NewRequestForm';
import documentTypesFixture from '../../cypress/fixtures/document_types/index.json';
import { ResponseMapper } from '../boundary/response-mapper';

const documentTypes = documentTypesFixture.map((dt) =>
  ResponseMapper.mapDocumentType(dt)
);

const team = {
  name: 'Example Service',
  googleGroup: 'example-service',
  id: '1',
  reasons: [
    {
      name: 'example-reason',
      id: '123',
    },
  ],
};

const promise = Promise.resolve();
const mockHandler = jest.fn(() => promise);

const values = {
  deliveryMethods: ['SMS', 'EMAIL'],
  documentTypes: ['passport-scan'],
  resident: {
    email: 'example@email.com',
    name: 'Example name',
    phoneNumber: '07777777777',
  },
  serviceRequestedBy: 'Example Service',
  reason: 'example-reason',
};

const fillInForm = () => {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: values.resident.name },
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: values.resident.email },
  });
  fireEvent.change(screen.getByLabelText('Mobile phone number'), {
    target: { value: values.resident.phoneNumber },
  });
  fireEvent.click(screen.getByText(documentTypes[0].title));
};

describe('NewRequestFormForm', () => {
  it('renders an uploader panel and a continue button', async () => {
    render(
      <NewRequestForm
        documentTypes={documentTypes}
        team={team}
        onSubmit={mockHandler}
      />
    );
    expect(screen.getByLabelText('Name')).toBeVisible();
    expect(screen.getByLabelText('Email')).toBeVisible();
    expect(screen.getByLabelText('Mobile phone number')).toBeVisible();

    expect(screen.getByLabelText('Send request by SMS')).toBeChecked();
    expect(screen.getByLabelText('Send request by email')).toBeChecked();

    expect(screen.getByText('Passport')).toBeVisible();
    expect(screen.getByText('Driving license')).toBeVisible();
    expect(screen.getByText('Bank statement')).toBeVisible();

    expect(screen.getByText('Send request')).toBeVisible();
  });

  it('validates all three contact details and an evidence type are present', async () => {
    render(
      <NewRequestForm
        documentTypes={documentTypes}
        team={team}
        onSubmit={mockHandler}
      />
    );
    fireEvent.click(screen.getByText('Send request'));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter the resident's name")
      ).toBeVisible();
      expect(
        screen.getByText("Please enter the resident's email address")
      ).toBeVisible();
      expect(
        screen.getByText("Please enter the resident's phone number")
      ).toBeVisible();
      expect(screen.getByText('Please choose a document type')).toBeVisible();
    });
  });

  it('calls the submit handler', async () => {
    render(
      <NewRequestForm
        documentTypes={documentTypes}
        team={team}
        onSubmit={mockHandler}
      />
    );

    fillInForm();

    fireEvent.click(screen.getByText('Send request'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Yes, send this request'));
    });

    // https://egghead.io/lessons/jest-fix-the-not-wrapped-in-act-warning
    await act(() => promise);

    expect(mockHandler).toHaveBeenCalledWith(values);
  });

  it('prevents double-submits', async () => {
    render(
      <NewRequestForm
        documentTypes={documentTypes}
        team={team}
        onSubmit={mockHandler}
      />
    );

    fillInForm();

    fireEvent.click(screen.getByText('Send request'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Yes, send this request'));

      const foundButton = screen.getByText('Send request').closest('button');
      expect(foundButton && foundButton.disabled).toBeTruthy();
    });

    // https://egghead.io/lessons/jest-fix-the-not-wrapped-in-act-warning
    await act(() => promise);
  });
});
