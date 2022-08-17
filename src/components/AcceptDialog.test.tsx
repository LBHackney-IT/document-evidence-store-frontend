import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AcceptDialog from './AcceptDialog';
import DocumentTypesFixture from '../../cypress/fixtures/document_types/index.json';
import { ResponseMapper } from '../boundary/response-mapper';

const yesAcceptButtonText = 'Yes, accept';
const mockHandler = jest.fn();
const staffSelectedDocumentTypes = DocumentTypesFixture.map(
  ResponseMapper.mapDocumentType
);

describe('AcceptDialog', () => {
  it('renders two radio buttons, three date fields, and two buttons', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        email="email@email"
        documentSubmissionId="123"
        redirect="foo"
      />
    );
    // Two radio buttons
    expect(screen.getByText('Proof of ID'));
    expect(screen.getByText('Repairs photo'));

    // Three data fields
    expect(screen.getByText('Day'));
    expect(screen.getByText('Month'));
    expect(screen.getByText('Year'));

    // Two buttons
    expect(screen.getByText(yesAcceptButtonText));
    expect(screen.getByText('No, cancel'));
  });

  it('validates that a document type is selected', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        email="email@email"
        documentSubmissionId="123"
        redirect="foo"
      />
    );
    fireEvent.click(screen.getByText(yesAcceptButtonText));

    await waitFor(() => {
      expect(screen.getByText('Please choose a document type'));
    });
  });

  it('throws error when impossible date is entered', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        email="email@email"
        documentSubmissionId="123"
        redirect="foo"
      />
    );

    fireEvent.click(screen.getByText('Proof of ID'));

    fireEvent.change(screen.getByTestId('input-day'), {
      target: { value: '31' },
    });
    fireEvent.change(screen.getByTestId('input-month'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByTestId('input-year'), {
      target: { value: '2022' },
    });

    fireEvent.click(screen.getByText(yesAcceptButtonText));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid date'));
    });
  });

  it('throws error when incomplete date is entered', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        email="email@email"
        documentSubmissionId="123"
        redirect="foo"
      />
    );

    fireEvent.click(screen.getByText('Proof of ID'));

    fireEvent.change(screen.getByTestId('input-day'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByTestId('input-year'), {
      target: { value: '2023' },
    });

    fireEvent.click(screen.getByText(yesAcceptButtonText));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid date'));
    });
  });

  it('validates that a possible date is entered', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        email="email@email"
        documentSubmissionId="123"
        redirect="foo"
      />
    );

    fireEvent.click(screen.getByText('Proof of ID'));

    fireEvent.change(screen.getByTestId('input-day'), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByTestId('input-month'), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByTestId('input-year'), {
      target: { value: '2022' },
    });

    fireEvent.click(screen.getByText(yesAcceptButtonText));

    const errorMessage = screen.queryByText('Please enter a valid date');
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('checks submit button is disabled', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        email="email@email"
        documentSubmissionId="123"
        redirect="foo"
      />
    );

    fireEvent.click(screen.getByText('Proof of ID'));
    fireEvent.click(screen.getByText(yesAcceptButtonText));

    // Assert
    // button is disabled
    const foundButton = screen.getByText(yesAcceptButtonText).closest('button');
    expect(foundButton && foundButton.disabled).toBeTruthy();
    // fires the handler properly
  });
});
