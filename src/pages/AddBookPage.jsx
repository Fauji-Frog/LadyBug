import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createAvailableListing, createWantedListing } from '../services/api';

export default function AddBookPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Mode: 'have' (I Have - Sell) or 'want' (I Want - Request)
  const [activeTab, setActiveTab] = useState('have');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '',
    condition: 'Good',
    price: '',
    department: currentUser?.department || 'Computer Science',
    courseCode: '',
    pickupLocation: 'Main Campus Library',
    description: '',
    urgency: 'Medium',
    studentName: currentUser?.fullName || 'Student User',
    contactInfo: currentUser?.email || 'student@campus.edu',
    phone: currentUser?.phone || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  const departments = [
    'Computer Science',
    'Biological Sciences',
    'Economics & Finance',
    'Mathematics & Statistics',
    'Chemistry & Biochemistry',
    'Physics & Astronomy',
    'Psychology',
    'Engineering',
    'Literature & Humanities',
    'Business Administration'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Book Title is required.';
    if (!formData.author.trim()) errs.author = 'Author name is required.';
    if (!formData.edition.trim()) errs.edition = 'Edition cannot be empty (e.g. 4th Edition or 2024).';

    if (activeTab === 'have') {
      if (!formData.price || Number(formData.price) <= 0) {
        errs.price = 'Price is required for listed books (must be greater than $0).';
      }
    }

    if (!formData.studentName.trim()) errs.studentName = 'Student name is required.';
    if (!formData.contactInfo.trim()) errs.contactInfo = 'Contact email is required.';

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
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessResult(null);

    try {
      if (activeTab === 'have') {
        const payload = {
          title: formData.title,
          author: formData.author,
          edition: formData.edition,
          condition: formData.condition,
          price: Number(formData.price),
          department: formData.department,
          courseCode: formData.courseCode,
          pickupLocation: formData.pickupLocation,
          description: formData.description,
          studentName: formData.studentName,
          sellerContact: formData.contactInfo,
          phone: formData.phone
        };
        const res = await createAvailableListing(payload);
        setSuccessResult({
          type: 'have',
          book: res.data,
          notice: res.notice || 'Book listed successfully for student discovery!'
        });
      } else {
        const payload = {
          title: formData.title,
          author: formData.author,
          edition: formData.edition,
          department: formData.department,
          courseCode: formData.courseCode,
          studentName: formData.studentName,
          contact: formData.contactInfo,
          phone: formData.phone,
          notes: formData.description,
          urgency: formData.urgency
        };
        const res = await createWantedListing(payload);
        setSuccessResult({
          type: 'want',
          book: res.data,
          notice: res.notice || 'Book request posted to campus wanted board!'
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ form: 'Failed to submit. Please check your network connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      edition: '',
      condition: 'Good',
      price: '',
      department: currentUser?.department || 'Computer Science',
      courseCode: '',
      pickupLocation: 'Main Campus Library',
      description: '',
      urgency: 'Medium',
      studentName: currentUser?.fullName || '',
      contactInfo: currentUser?.email || '',
      phone: currentUser?.phone || ''
    });
    setSuccessResult(null);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '0.4rem' }}>
            Campus Textbook Exchange
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-dark-espresso)', marginBottom: '0.5rem' }}>
            List or Request a Book
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-dark-espresso-muted)' }}>
            Choose whether you have a textbook to pass on or are looking for a required course text.
          </p>
        </div>

        {/* Tab Selection Cards (I Have vs I Want) */}
        <div className="tab-toggle-container">
          <button
            type="button"
            className={`tab-toggle-btn ${activeTab === 'have' ? 'tab-toggle-active' : ''}`}
            onClick={() => { setActiveTab('have'); setSuccessResult(null); }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📗</span>
              <span>I Have (List for Sale)</span>
            </div>
          </button>

          <button
            type="button"
            className={`tab-toggle-btn ${activeTab === 'want' ? 'tab-toggle-active' : ''}`}
            onClick={() => { setActiveTab('want'); setSuccessResult(null); }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <span>I Want (Request Book)</span>
            </div>
          </button>
        </div>

        {/* Success Confirmation Card */}
        {successResult && (
          <div className="editorial-card" style={{
            backgroundColor: '#EBF5EE',
            border: '1.5px solid #BDE3CA',
            color: '#1E4620',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
            animation: 'modalSlideUp 0.3s ease-out'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              {successResult.type === 'have' ? 'Textbook Listed on ReLeaf!' : 'Wanted Request Published!'}
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#2B5A33' }}>
              "{successResult.book?.title}" by {successResult.book?.author} ({successResult.book?.edition}) is now active on campus.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to={successResult.type === 'have' ? '/available' : '/wanted'}
                className="btn btn-primary"
              >
                View in {successResult.type === 'have' ? 'Available Books' : 'Wanted Board'}
              </Link>
              <button onClick={resetForm} className="btn btn-outline" style={{ backgroundColor: '#FFFFFF' }}>
                Add Another Book
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        {!successResult && (
          <div className="editorial-card" style={{ padding: '2.25rem' }}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Form Global Error */}
              {errors.form && (
                <div style={{
                  backgroundColor: 'var(--color-muted-tomato-light)',
                  color: 'var(--color-muted-tomato-dark)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem'
                }}>
                  {errors.form}
                </div>
              )}

              {/* Book Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Book Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Introduction to Algorithms or Campbell Biology"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: errors.title ? 'var(--color-muted-tomato)' : undefined }}
                />
                {errors.title && <span className="form-error-msg">{errors.title}</span>}
              </div>

              {/* Author & Edition */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="author">
                    Author(s) *
                  </label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    placeholder="e.g. Thomas H. Cormen, et al."
                    value={formData.author}
                    onChange={handleChange}
                    style={{ borderColor: errors.author ? 'var(--color-muted-tomato)' : undefined }}
                  />
                  {errors.author && <span className="form-error-msg">{errors.author}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edition">
                    Edition *
                  </label>
                  <input
                    id="edition"
                    name="edition"
                    type="text"
                    placeholder="e.g. 4th Edition or 2023 Revision"
                    value={formData.edition}
                    onChange={handleChange}
                    style={{ borderColor: errors.edition ? 'var(--color-muted-tomato)' : undefined }}
                  />
                  {errors.edition && <span className="form-error-msg">{errors.edition}</span>}
                </div>
              </div>

              {/* Specific fields for "I Have": Condition & Price */}
              {activeTab === 'have' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="condition">
                      Condition *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                    >
                      <option value="New">New (Like brand new / unopened)</option>
                      <option value="Good">Good (Minor wear, clean pages)</option>
                      <option value="Used">Used (Highlighting or cover wear, all readable)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="price">
                      Price ($ USD) *
                    </label>
                    <div className="input-with-icon">
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 45"
                        value={formData.price}
                        onChange={handleChange}
                        style={{ borderColor: errors.price ? 'var(--color-muted-tomato)' : undefined }}
                      />
                    </div>
                    {errors.price && <span className="form-error-msg">{errors.price}</span>}
                  </div>
                </div>
              )}

              {/* Specific field for "I Want": Urgency */}
              {activeTab === 'want' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="urgency">
                    Request Urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                  >
                    <option value="Low">Low – Anytime this semester</option>
                    <option value="Medium">Medium – Needed within 2-3 weeks</option>
                    <option value="Urgent">Urgent – Needed for imminent exam / assignment</option>
                  </select>
                </div>
              )}

              {/* Academic Department & Course Code */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="department">
                    Department
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
                  <label className="form-label" htmlFor="courseCode">
                    Course Code (Optional)
                  </label>
                  <input
                    id="courseCode"
                    name="courseCode"
                    type="text"
                    placeholder="e.g. CS301 or BIO101"
                    value={formData.courseCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Student Name & Contact Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="studentName">
                    Student Name *
                  </label>
                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    value={formData.studentName}
                    onChange={handleChange}
                    style={{ borderColor: errors.studentName ? 'var(--color-muted-tomato)' : undefined }}
                  />
                  {errors.studentName && <span className="form-error-msg">{errors.studentName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactInfo">
                    Contact Email *
                  </label>
                  <input
                    id="contactInfo"
                    name="contactInfo"
                    type="email"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    style={{ borderColor: errors.contactInfo ? 'var(--color-muted-tomato)' : undefined }}
                  />
                  {errors.contactInfo && <span className="form-error-msg">{errors.contactInfo}</span>}
                </div>
              </div>

              {/* Description / Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  {activeTab === 'have' ? 'Condition Details & Notes' : 'Request Notes & Target Budget'}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder={activeTab === 'have'
                    ? 'e.g. Barely used, no pen markings, includes study chart.'
                    : 'e.g. Willing to pay up to $40 for good condition. Can meet at library.'}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  {isSubmitting
                    ? 'Submitting to Campus...'
                    : activeTab === 'have' ? 'Publish Available Listing' : 'Submit Wanted Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
