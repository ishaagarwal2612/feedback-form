import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Hello from App!', () => {
  render(<App />);
  expect(screen.getByText(/Hello from App!/i)).toBeInTheDocument();
});
