import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import RemovePanelButton from './RemovePanelButton';

describe.only('remove panel button', () => {
  it('renders the button', () => {
    render(<RemovePanelButton removePanel={jest.fn()} panelIndex={1} />);
    expect(screen.getByRole('button')).not.toBeNull();
  });
  it('calls the removePanel function when it is clicked', () => {
    const removePanelHandler = jest.fn();
    render(
      <RemovePanelButton removePanel={removePanelHandler} panelIndex={1} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(removePanelHandler).toHaveBeenCalled();
  });
});
