import React, { useState } from 'react';

/**
 * Footer Component (Reusable Component 4)
 * Contains contact banner, interactive clipboard copy, copyright, and student credentials.
 * 
 * @param {Object} props
 * @param {Object} props.student - Student details
 */
export default function Footer({ student }) {
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(student.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <footer id="contact" className="footer-container">
      <div className="contact-card">
        <h3 className="contact-title">Let's Connect</h3>
        <p className="contact-subtitle">
          Interested in discussing internship opportunities or engineering collaborations?
        </p>

        <div className="contact-buttons-row">
          <a href={`mailto:${student.email}`} className="btn btn-primary">
            Send an Email
          </a>
          <button onClick={handleCopyEmail} className="btn btn-secondary">
            {copied ? 'Copied to Clipboard! ✓' : 'Copy Email Address'}
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} {student.name} &bull; {student.degree} ({student.semester})
        </p>
        <p className="footer-subtext">
          Built with React &amp; Component Architecture (Header, About, Skills, Projects, Footer).
        </p>
      </div>
    </footer>
  );
}
