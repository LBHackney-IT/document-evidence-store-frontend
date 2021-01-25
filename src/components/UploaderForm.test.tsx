import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import { ResponseMapper } from '../boundary/response-mapper';
import DocumentSubmissionFixture from '../../cypress/fixtures/document-submission-response-singular.json';
import { FormValues } from 'src/services/upload-form-model';

const mockHandleSubmit = jest.fn();
const successHandler = jest.fn();

jest.mock('../services/upload-form-model', () => {
  const { UploadFormModel } = jest.requireActual(
    '../services/upload-form-model'
  );

  class MockFormModel extends UploadFormModel {
    handleSubmit(values: FormValues) {
      mockHandleSubmit(values);
    }
  }

  return { UploadFormModel: MockFormModel };
});

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
    render(
      <UploaderForm
        requestId="foo"
        submissions={documentSubmissions}
        onSuccess={successHandler}
      />
    );
  });

  it('renders an uploader panel and a continue button', async () => {
    expect(screen.getByText('Passport'));
    expect(screen.getByText('A valid passport open at the photo page'));
    expect(screen.getByText('Continue'));
  });

  it('disables the button when submitting', async () => {
    attachFile('Passport');
    submitForm();

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

  it('calls submit handler on form model', async () => {
    attachFile('Passport');
    submitForm();

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it('shows error when submission goes wrong', async () => {
    mockHandleSubmit.mockImplementation(() => {
      throw new Error('oh no');
    });
    attachFile('Passport');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('There was an error. Please try again later'));
    });
  });

  it('calls success callback when upload completes', async () => {
    mockHandleSubmit.mockResolvedValue(true);
    attachFile('Passport');
    submitForm();

    await waitFor(() => {
      expect(successHandler).toHaveBeenCalled();
    });
  });
});
