import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import { ResponseMapper } from '../boundary/response-mapper';
import DocumentTypesFixture from '../../cypress/fixtures/document_types/index.json';
import * as MockUploadFormModelImport from '../services/__mocks__/upload-form-model';
import * as UploadFormModelImport from '../services/upload-form-model';

const successHandler = jest.fn();
const {
  UploadFormModel,
  mockHandleSubmit,
} = (UploadFormModelImport as unknown) as jest.Mocked<
  typeof MockUploadFormModelImport
>;

jest.mock('../services/upload-form-model');

const documentTypes = DocumentTypesFixture.map(ResponseMapper.mapDocumentType);

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
        evidenceRequestId={'123'}
        documentTypes={documentTypes}
        onSuccess={successHandler}
      />
    );
  });

  it('renders an uploader panel and a continue button', async () => {
    expect(screen.getByText('Proof of ID'));
    expect(
      screen.getByText('A valid document that can be used to prove identity')
    );
    expect(screen.getByText('Continue'));
  });

  it('creates a form model with the correct attributes', () => {
    expect(UploadFormModel).toHaveBeenCalledWith(documentTypes);
  });

  it('disables the button when submitting', async () => {
    attachFile('Proof of ID');
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText('Continue').closest('button')?.disabled
      ).toBeTruthy();
    });
  });

  it('validates at least one file is attached to each UploaderPanel', async () => {
    submitForm();
    await waitFor(() => {
      // we have 2 DocumentTypes so there should be as many warning messages printed
      expect(screen.getAllByText('Please select a file').length).toEqual(2);
    });
  });

  it('calls submit handler on form model', async () => {
    attachFile('Proof of ID');
    attachFile('Repairs photo');
    submitForm();

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it('shows error when submission goes wrong', async () => {
    mockHandleSubmit.mockImplementation(() => {
      throw new Error('oh no');
    });
    attachFile('Proof of ID');
    attachFile('Repairs photo');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('There was an error. Please try again later'));
    });
  });

  it('calls success callback when upload completes', async () => {
    mockHandleSubmit.mockResolvedValue(true);
    attachFile('Proof of ID');
    attachFile('Repairs photo');
    submitForm();

    await waitFor(() => {
      expect(successHandler).toHaveBeenCalled();
    });
  });
});
