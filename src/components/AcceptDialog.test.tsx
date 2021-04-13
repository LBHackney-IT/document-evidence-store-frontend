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
        onAccept={mockHandler}
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
        onAccept={mockHandler}
      />
    );
    fireEvent.click(screen.getByText(yesAcceptButtonText));

    await waitFor(() => {
      expect(screen.getByText('Please choose a document type'));
    });
  });

  it('prevents double-submits', async () => {
    render(
      <AcceptDialog
        open={true}
        onDismiss={mockHandler}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        onAccept={mockHandler}
      />
    );

    fireEvent.click(screen.getByText('Proof of ID'));
    fireEvent.click(screen.getByText(yesAcceptButtonText));

    // Assert
    // button is disabled
    const foundButton = screen.getByText(yesAcceptButtonText).closest('button');
    expect(foundButton && foundButton.disabled).toBeTruthy();
    // fires the handler properly
    await waitFor(() => {
      expect(mockHandler).toBeCalledTimes(1);
    });
  });
});
