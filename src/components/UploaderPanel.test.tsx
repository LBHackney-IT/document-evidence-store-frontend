import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UploaderPanel from './UploaderPanel';
import { Formik, Form } from 'formik';

test('is properly named, and labelled', async () => {
  render(
    <UploaderPanel
      label="Example label"
      name="exampleName"
      setFieldValue={() => {}}
    />
  );
  expect(screen.getByLabelText('Example label'));
  expect(screen.getByTestId('fileInput')).toHaveProperty('name', 'exampleName');
  expect(screen.getByTestId('fileInput')).toHaveProperty('value', '');
});

test('accepts jpeg files', async () => {
  const mockHandler = jest.fn();
  const mockImage = new File(['example'], 'file.jpg', { type: 'image/jpeg' });

  render(
    <UploaderPanel
      label="Example label"
      name="exampleName"
      setFieldValue={mockHandler}
    />
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
    <UploaderPanel
      label="Example label"
      name="exampleName"
      setFieldValue={mockHandler}
    />
  );

  Object.defineProperty(screen.getByTestId('fileInput'), 'files', {
    value: [mockPdf],
  });
  fireEvent.change(screen.getByTestId('fileInput'));
  expect(mockHandler).toHaveBeenCalledTimes(1);
});

test('displays hints', async () => {
  render(
    <UploaderPanel
      label="Example label"
      name="exampleName"
      hint="Example hint"
      setFieldValue={() => {}}
    />
  );
  expect(screen.getByText('Example hint'));
});

test('displays errors', async () => {
  render(
    <UploaderPanel
      label="Example label"
      name="exampleName"
      error="Example error"
      setFieldValue={() => {}}
    />
  );
  expect(screen.getByText('Example error'));
});
