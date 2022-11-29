import { fireEvent, render, screen } from '@testing-library/react';
import { FormikValues } from 'formik';
import React from 'react';
import RemovePanelButton from './RemovePanelButton';

describe.only('remove panel button', () => {
  it('renders the button', () => {
    render(
      <RemovePanelButton
        removePanel={jest.fn()}
        panelIndex={1}
        formValues={[]}
        error={null}
      />
    );
    expect(screen.getByRole('button')).not.toBeNull();
  });
  it('calls the removePanel function when it is clicked', () => {
    var testFormValues: FormikValues = {
      staffUploaderPanel: [{}, {}, {}],
    };
    var removePanelHandler = jest.fn();
    render(
      <RemovePanelButton
        removePanel={removePanelHandler}
        panelIndex={1}
        formValues={testFormValues}
        error={null}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(removePanelHandler).toHaveBeenCalled();
  });
});
