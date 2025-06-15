import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackForm from './FeedbackForm';

// Mock supabase
jest.mock('../config/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  },
}));

describe('FeedbackForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup() {
    return render(<FeedbackForm />);
  }

  it('renders all form fields and submit button', () => {
    setup();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Great app!' } });
    expect(screen.getByLabelText(/name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Great app!');
  });

  it('submits form successfully and shows thank you message', async () => {
    const { supabase } = require('../config/supabaseClient');
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: '1' } } });
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Feedback message' } });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      expect(screen.getByText(/your feedback has been submitted/i)).toBeInTheDocument();
    });
  });

  it('shows error if user is not authenticated', async () => {
    const { supabase } = require('../config/supabaseClient');
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Feedback message' } });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));
    await waitFor(() => {
      expect(screen.getByText(/user not authenticated/i)).toBeInTheDocument();
    });
  });

  it('shows error if supabase insert fails', async () => {
    const { supabase } = require('../config/supabaseClient');
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: '1' } } });
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: { message: 'Insert failed' } }),
    });
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Feedback message' } });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));
    await waitFor(() => {
      expect(screen.getByText(/insert failed/i)).toBeInTheDocument();
    });
  });

  it('disables inputs and button when loading', async () => {
    const { supabase } = require('../config/supabaseClient');
    let resolvePromise;
    supabase.auth.getUser.mockReturnValue(new Promise((resolve) => { resolvePromise = resolve; }));
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Feedback message' } });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));
    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/message/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    // Finish promise
    resolvePromise({ data: { user: null } });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit feedback/i })).not.toBeDisabled();
    });
  });

  it('resets form and state when "Submit Another Feedback" is clicked', async () => {
    const { supabase } = require('../config/supabaseClient');
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: '1' } } });
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Feedback message' } });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /submit another feedback/i }));
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });
});
