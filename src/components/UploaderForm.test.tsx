import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import { ResponseMapper } from '../boundary/response-mapper';
import DocumentSubmissionFixture from '../../cypress/fixtures/document-submission-response-singular.json';

const documentSubmissions = [
  ResponseMapper.mapDocumentSubmission(DocumentSubmissionFixture),
];

const attachFile = (label: string) => {
  const file = new File(['dummy content'], 'example.png', {
    type: 'image/png',
  });
  fireEvent.change(screen.getByLabelText(label), {
    target: { files: [file] },
  });
};

const submitForm = () => fireEvent.click(screen.getByText('Continue'));

describe('UploaderForm', () => {
  beforeEach(() => {
    render(<UploaderForm requestId="foo" submissions={documentSubmissions} />);
  });

  it('renders an uploader panel and a continue button', async () => {
    expect(screen.getByText('Passport'));
    expect(screen.getByText('A valid passport open at the photo page'));
    expect(screen.getByText('Continue'));
  });

  it('disables the button when submitting', async () => {
    submitForm();
    attachFile('Passport');

    await waitFor(() => {
      expect(
        screen.getByText('Continue').closest('button')?.disabled
      ).toBeTruthy();
    });
  });

  it('validates files are attached', async () => {
    submitForm();
    await waitFor(() => {
      expect(screen.getByText('Please select a file'));
    });
  });
});
