import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import UploaderPanel from './UploaderPanel';

test('is properly named, and labelled', async () => {
  render(
    <UploaderPanel
      label="Example label"
      name="exampleName"
      setFieldValue={jest.fn()}
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

test('accepts multiple files', async () => {
  const mockHandler = jest.fn();
  const mockImage = new File(['example'], 'file.jpg', { type: 'image/jpeg' });
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
    value: [mockImage, mockPdf],
  });
  fireEvent.change(screen.getByTestId('fileInput'));
  expect(mockHandler).toHaveBeenCalledTimes(1);
});

test('removes selected files', async () => {
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
  fireEvent.click(screen.getByTestId('clear-selection-button'));
  expect(mockHandler).toHaveBeenCalledTimes(2);
});

test('displays hints', async () => {
  render(
    <UploaderPanel
      label="Example label"
      name="exampleName"
      hint="Example hint"
      setFieldValue={jest.fn()}
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
      setFieldValue={jest.fn()}
    />
  );
  expect(screen.getByText('Example error'));
});
