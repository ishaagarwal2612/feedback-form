import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './login';

// Mock supabase
jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  function setup() {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  }

  it('renders login form elements', () => {
    setup();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
  });

  it('updates input values on change', () => {
    setup();
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form and navigates on success', async () => {
    const { supabase } = require('../../config/supabaseClient');
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '1' }, session: { access_token: 'token123' } },
      error: null,
    });
    setup();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(localStorage.getItem('userToken')).toBe('token123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message on failed login', async () => {
    const { supabase } = require('../../config/supabaseClient');
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });
    setup();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      expect(localStorage.getItem('userToken')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('disables inputs and button when loading', async () => {
    const { supabase } = require('../../config/supabaseClient');
    let resolvePromise: any;
    supabase.auth.signInWithPassword.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );
    setup();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    // Finish promise
    resolvePromise({ data: null, error: { message: 'fail' } });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
    });
  });

  it('clears error when input changes', async () => {
    const { supabase } = require('../../config/supabaseClient');
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });
    setup();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'new@test.com' } });
    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });
});
