import { fireEvent, render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';
import RemovePanelButton from './RemovePanelButton';

describe.only('remove panel button', () => {
  it('renders the button', () => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <RemovePanelButton removePanel={jest.fn()} panelIndex={1} />
      </Formik>
    );
    expect(screen.getByRole('button')).not.toBeNull();
  });
  it('calls the removePanel function when it is clicked', () => {
    const removePanelHandler = jest.fn();
    render(
      <Formik
        initialValues={{
          staffUploaderPanel: ['test', 'test'],
        }}
        onSubmit={jest.fn()}
      >
        <RemovePanelButton removePanel={removePanelHandler} panelIndex={1} />
      </Formik>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(removePanelHandler).toHaveBeenCalled();
  });
});
