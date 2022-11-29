import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import StaffUploaderPanel from './StaffUploaderPanel';
import { Formik } from 'formik';
import { UploaderPanelError } from './StaffUploaderForm';

test('is properly named', async () => {
  render(
    <Formik
      initialValues={{ exampleName: false }}
      onSubmit={() => console.log('submitted')}
    >
      <StaffUploaderPanel
        name="exampleName"
        staffSelectedDocumentTypes={[]}
        setFieldValue={jest.fn()}
        removePanel={jest.fn()}
        panelIndex={1}
        formValues={[]}
      />
    </Formik>
  );
  expect(screen.getByTestId('fileInput')).toHaveProperty('name', 'exampleName');
  expect(screen.getByTestId('fileInput')).toHaveProperty('value', '');
});

test('accepts jpeg files', async () => {
  const mockHandler = jest.fn();
  const mockImage = new File(['example'], 'file.jpg', { type: 'image/jpeg' });

  render(
    <Formik
      initialValues={{ exampleName: false }}
      onSubmit={() => console.log('submitted')}
    >
      <StaffUploaderPanel
        name="exampleName"
        staffSelectedDocumentTypes={[]}
        setFieldValue={mockHandler}
        removePanel={jest.fn()}
        panelIndex={1}
        formValues={[]}
      />
    </Formik>
  );

  Object.defineProperty(screen.getByTestId('fileInput'), 'files', {
    value: [mockImage],
  });
  fireEvent.change(screen.getByTestId('fileInput'));
  expect(mockHandler).toHaveBeenCalledTimes(1);
});

test('accepts pdf files', async () => {
  const mockHandler = jest.fn();
  const mockPdf = new File(['example'], 'file.pdf', {
    type: 'application/pdf',
  });

  render(
    <Formik
      initialValues={{ exampleName: false }}
      onSubmit={() => console.log('submitted')}
    >
      <StaffUploaderPanel
        name="exampleName"
        staffSelectedDocumentTypes={[]}
        setFieldValue={mockHandler}
        removePanel={jest.fn()}
        panelIndex={1}
        formValues={[]}
      />
    </Formik>
  );

  Object.defineProperty(screen.getByTestId('fileInput'), 'files', {
    value: [mockPdf],
  });
  fireEvent.change(screen.getByTestId('fileInput'));
  expect(mockHandler).toHaveBeenCalledTimes(1);
});

test('displays errors', async () => {
  const mockError: UploaderPanelError = {
    staffSelectedDocumentType: 'mock',
    description: 'mockError',
    files: [],
  };
  const { container } = render(
    <Formik
      initialValues={{ exampleName: false }}
      onSubmit={() => console.log('submitted')}
    >
      <StaffUploaderPanel
        name="exampleName"
        staffSelectedDocumentTypes={[]}
        setFieldValue={jest.fn()}
        removePanel={jest.fn()}
        panelIndex={0}
        formValues={[]}
        error={mockError}
      />
    </Formik>
  );
  expect(container.getElementsByClassName('govuk-error-message'));
});
