import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Checkbox from './Checkbox';
import { Formik, Form } from 'formik';

test('is properly named, labelled and responds to clicks', async () => {
  render(
    <Formik
      initialValues={{ exampleName: false }}
      onSubmit={() => console.log('submitted')}
    >
      <Form>
        <Checkbox label="Example label" name="exampleName" id="exampleName" />
      </Form>
    </Formik>
  );

  expect(screen.getByLabelText('Example label'));
  expect(screen.getByRole('checkbox')).toHaveProperty('checked', false);
  expect(screen.getByRole('checkbox')).toHaveProperty('name', 'exampleName');

  fireEvent.click(screen.getByLabelText('Example label'));

  await waitFor(() =>
    expect(screen.getByRole('checkbox')).toHaveProperty('checked', true)
  );
});
