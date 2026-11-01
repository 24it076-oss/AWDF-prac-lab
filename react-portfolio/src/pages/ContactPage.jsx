import React, { useState } from 'react';

/**
 * ContactPage Component (Route: /contact)
 * Demonstrates:
 * 1. Controlled Form State Management (name, email, subject, message)
 * 2. Form Validation & Submission State
 * 3. Reactive State to dynamically show/hide success message and accordion details
 */
export default function ContactPage({ student }) {
  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Internship Opportunity',
    message: ''
  });

  // Submission & validation state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showFaq, setShowFaq] = useState(false);

  // Controlled input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.message.trim()) newErrors.message = 'Message content cannot be blank';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success state transition
    setIsSubmitted(true);
    setErrors({});
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'Internship Opportunity',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="page-contact">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Contact Me</h1>
          <p className="page-subtitle">
            Controlled form state handling with reactive validation and instant feedback.
          </p>
        </div>
        <span className="section-tag">Route: /contact</span>
      </div>

      <div className="contact-grid-layout">
        {/* Left Column: Direct Info & Show/Hide FAQ */}
        <div className="contact-info-panel">
          <div className="info-card">
            <h3 className="info-heading">Direct Details</h3>
            <p className="info-item">
              <strong>Student:</strong> {student.name}
            </p>
            <p className="info-item">
              <strong>Academic Status:</strong> {student.degree} ({student.semester})
            </p>
            <p className="info-item">
              <strong>Email:</strong> <span className="mono-text">{student.email}</span>
            </p>
            <p className="info-item">
              <strong>Location:</strong> Campus / City, India
            </p>
          </div>

          {/* Dynamic Show/Hide Accordion State */}
          <div className="faq-toggle-card">
            <button
              onClick={() => setShowFaq((prev) => !prev)}
              className="faq-toggle-btn"
              type="button"
            >
              <span>{showFaq ? '▼ Hide Availability FAQ' : '▶ Show Availability FAQ'}</span>
              <span className="badge-tag">Reactive State</span>
            </button>

            {showFaq && (
              <div className="faq-content-box">
                <p><strong>Q: When are you available for internships?</strong></p>
                <p>A: Available for Summer 2025/2026 internships and remote part-time projects.</p>
                <p style={{ marginTop: '0.5rem' }}><strong>Q: What is your primary stack?</strong></p>
                <p>A: React, JavaScript, C++, Node.js, and SQL/MongoDB.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Controlled Input Form */}
        <div className="contact-form-panel">
          {isSubmitted ? (
            /* Dynamically Shown on Submission */
            <div className="submission-success-card">
              <div className="success-icon">✓</div>
              <h3 className="success-title">Message Received Successfully!</h3>
              <p className="success-desc">
                Thank you <strong>{formData.name}</strong>. Your inquiry regarding <em>"{formData.subject}"</em> has been logged in React state.
              </p>
              <div className="submitted-preview-box">
                <p className="mono-sub"><strong>Sender:</strong> {formData.email}</p>
                <p className="mono-sub"><strong>Message:</strong> "{formData.message}"</p>
              </div>
              <button onClick={handleResetForm} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            /* Form Component with Reactive Controlled Inputs */
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <h3 className="form-title">Send a Direct Message</h3>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Alex Sharma"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@domain.com"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Subject Field (Controlled Select) */}
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input form-select"
                >
                  <option value="Internship Opportunity">Internship Opportunity</option>
                  <option value="Project Collaboration">Project Collaboration</option>
                  <option value="Technical Query">Technical Query / Discussion</option>
                  <option value="General Greetings">General Greetings</option>
                </select>
              </div>

              {/* Message Field */}
              <div className="form-group">
                <div className="label-with-counter">
                  <label htmlFor="message" className="form-label">
                    Message <span className="required">*</span>
                  </label>
                  <span className="char-counter">{formData.message.length} chars</span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Hi Rishi, I saw your portfolio and would like to discuss..."
                  className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Message
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
