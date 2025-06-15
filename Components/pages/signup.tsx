import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import '../../style/Auth.css';

type SignupFormData = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignupFormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName
                    }
                }
            });

            if (error) {
                throw error;
            }

            if (data?.user) {
                // Some Supabase instances require email verification
                alert('Please check your email for verification link');
                navigate('/login');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to sign up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        disabled={loading}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                <div className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
