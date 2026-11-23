import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Science',
    batch: 'Class of 2026 (Junior)',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const departments = [
    'Computer Science',
    'Biological Sciences',
    'Economics & Finance',
    'Mathematics & Statistics',
    'Chemistry & Biochemistry',
    'Physics & Astronomy',
    'Psychology & Cognitive Science',
    'Mechanical Engineering',
    'Electrical & Computer Engineering',
    'English & Comparative Literature',
    'Business Administration',
    'Environmental Science'
  ];

  const batches = [
    'Class of 2028 (Freshman)',
    'Class of 2027 (Sophomore)',
    'Class of 2026 (Junior)',
    'Class of 2025 (Senior)',
    'Graduate / Master’s Candidate',
    'PhD Researcher'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'University Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid university email address.';
    }
    if (!formData.studentId.trim()) errs.studentId = 'Student ID number is required.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required for campus pickup coordination.';
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/login', {
          state: {
            message: 'Student account created successfully! Please enter your credentials to log in.'
          }
        });
      } else {
        setServerError(res.error || 'Registration failed. Please check your information.');
      }
    } catch {
      setServerError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="medium" withTagline={true} />
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            color: 'var(--color-dark-espresso)',
            marginTop: '1.25rem',
            marginBottom: '0.35rem'
          }}>
            Join ReLeaf Campus
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-espresso-subtle)' }}>
            Exchange academic textbooks with verified classmates.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div style={{
            backgroundColor: 'var(--color-muted-tomato-light)',
            border: '1px solid #F2B9B0',
            color: 'var(--color-muted-tomato-dark)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {serverError}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name & Student ID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g. Maya Lin"
                value={formData.fullName}
                onChange={handleChange}
                style={{ borderColor: errors.fullName ? 'var(--color-muted-tomato)' : undefined }}
              />
              {errors.fullName && <span className="form-error-msg">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="studentId">
                Student ID *
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="e.g. CS-2025-4401"
                value={formData.studentId}
                onChange={handleChange}
                style={{ borderColor: errors.studentId ? 'var(--color-muted-tomato)' : undefined }}
              />
              {errors.studentId && <span className="form-error-msg">{errors.studentId}</span>}
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                University Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. mlin@university.edu"
                value={formData.email}
                onChange={handleChange}
                style={{ borderColor: errors.email ? 'var(--color-muted-tomato)' : undefined }}
              />
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                style={{ borderColor: errors.phone ? 'var(--color-muted-tomato)' : undefined }}
              />
              {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
            </div>
          </div>

          {/* Department & Batch */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="batch">
                Academic Batch *
              </label>
              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              >
                {batches.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password & Confirm */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <div className="input-with-icon">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ borderColor: errors.password ? 'var(--color-muted-tomato)' : undefined }}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁' : '🔒'}
                </button>
              </div>
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <div className="input-with-icon">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ borderColor: errors.confirmPassword ? 'var(--color-muted-tomato)' : undefined }}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? '👁' : '🔒'}
                </button>
              </div>
              {errors.confirmPassword && <span className="form-error-msg">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}
          >
            {isSubmitting ? 'Creating Student Account...' : 'Complete Registration'}
          </button>

          {/* Link to Login */}
          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-dark-espresso-muted)' }}>
            Already have a student account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-forest-green)', textDecoration: 'underline' }}>
              Log In here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
