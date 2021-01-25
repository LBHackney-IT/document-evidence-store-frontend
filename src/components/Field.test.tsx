import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Field from './Field';
import { Formik, Form } from 'formik';

const submitSpy = jest.fn();

test('is properly named, labelled and responds to input', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={submitSpy}>
      <Form>
        <Field label="Example label" name="exampleName" />
      </Form>
    </Formik>
  );
  expect(screen.getByLabelText('Example label'));
  expect(screen.getByRole('textbox')).toHaveProperty('name', 'exampleName');
  expect(screen.getByRole('textbox')).toHaveProperty('value', '');
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'Example value' },
  });
  await waitFor(() =>
    expect(screen.getByRole('textbox')).toHaveProperty('value', 'Example value')
  );
});

test('displays hints', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={submitSpy}>
      <Form>
        <Field label="Example label" name="exampleName" hint="Example hint" />
      </Form>
    </Formik>
  );
  expect(screen.getByText('Example hint'));
});

test('displays errors', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={submitSpy}>
      <Form>
        <Field label="Example label" name="exampleName" error="Example error" />
      </Form>
    </Formik>
  );
  expect(screen.getByText('Example error'));
});

test('renders a textarea if asked', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={submitSpy}>
      <Form>
        <Field label="Example label" name="exampleName" textarea />
      </Form>
    </Formik>
  );
  expect(screen.getByTestId('textarea'));
});
