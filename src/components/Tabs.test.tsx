import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

test('it renders correctly', async () => {
  render(
    <Tabs
      tabTitles={['Tab one', 'Tab two']}
      // eslint-disable-next-line
      children={[<p>Tab panel one</p>, <p>Tab panel two</p>]}
    />
  );
  expect(screen.getByText('Tab one'));
  expect(screen.getByText('Tab two'));
  expect(screen.getByText('Tab panel one'));
});

test('it responds to clicks between tabs', async () => {
  render(
    <Tabs
      tabTitles={['Tab one', 'Tab two']}
      // eslint-disable-next-line
      children={[<p>Tab panel one</p>, <p>Tab panel two</p>]}
    />
  );
  fireEvent.click(screen.getByText('Tab two'));
  expect(screen.getByText('Tab panel one'));
});
