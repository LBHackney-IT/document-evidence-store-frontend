import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import NewRequestForm from './NewRequestForm';
import documentTypesFixture from '../../cypress/fixtures/document-types-response.json';
import { ResponseMapper } from '../boundary/response-mapper';

const documentTypes = documentTypesFixture.map((dt) =>
  ResponseMapper.mapDocumentType(dt)
);

const mockHandler = jest.fn();

describe('NewRequestFormForm', () => {
  it('renders an uploader panel and a continue button', async () => {
    render(
      <NewRequestForm documentTypes={documentTypes} onSubmit={mockHandler} />
    );
    expect(screen.getByLabelText('Name'));
    expect(screen.getByLabelText('Email'));
    expect(screen.getByLabelText('Mobile phone number'));

    expect(screen.getByLabelText('Send request by SMS'));
    expect(screen.getByLabelText('Send request by email'));

    expect(screen.getByLabelText('Passport'));
    expect(screen.getByLabelText('Driving license'));
    expect(screen.getByLabelText('Bank statement'));

    expect(screen.getByText('Send request'));
  });

  it('validates all three contact details and an evidence type are present', async () => {
    render(
      <NewRequestForm documentTypes={documentTypes} onSubmit={mockHandler} />
    );
    fireEvent.click(screen.getByText('Send request'));

    await waitFor(() => {
      expect(screen.getByText("Please enter the resident's name"));
      expect(screen.getByText("Please enter the resident's email address"));
      expect(screen.getByText("Please enter the resident's phone number"));
      expect(screen.getByText('What document do you want to request?'));
    });
  });

  it('prevents double-submits', async () => {
    render(
      <NewRequestForm documentTypes={documentTypes} onSubmit={mockHandler} />
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Example name' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'example@email.com' },
    });
    fireEvent.change(screen.getByLabelText('Mobile phone number'), {
      target: { value: '07777777777' },
    });
    fireEvent.click(screen.getByText(documentTypes[0].title));
    fireEvent.click(screen.getByText('Send request'));

    const foundButton = screen.getByText('Send request').closest('button');
    expect(foundButton && foundButton.disabled).toBeTruthy();
  });
});
