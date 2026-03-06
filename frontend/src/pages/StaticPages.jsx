import "./StaticPages.css";

/* ── Error ── */
export function ErrorPage({ message, onNavigate }) {
  return (
    <div className="static-page anim-fade-up">
      <div className="static-page__icon">⚠️</div>
      <h1 className="static-page__title">Something went wrong</h1>
      <p className="static-page__body">
        {message || "An unexpected error occurred."}
      </p>
      <button className="btn btn-primary" onClick={() => onNavigate("home")}>
        ← Back to Home
      </button>
    </div>
  );
}

/* ── Privacy ── */
export function PrivacyPage({ onNavigate }) {
  return (
    <div className="static-doc container-narrow anim-fade-up">
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 24 }}
        onClick={() => onNavigate("home")}
      >
        ← Back
      </button>
      <h1 className="static-doc__title">Privacy Policy</h1>
      <p className="static-doc__date">Last updated: January 1, 2025</p>
      <div className="static-doc__body">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, list a property, or contact us for support —
          including your name, email address, username, and listing details.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, process transactions, send you related information, and
          communicate with you about products, services, and events.
        </p>
        <h2>3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          described in this policy or with your consent. We may share
          information with service providers who assist in operating the
          platform.
        </p>
        <h2>4. Data Security</h2>
        <p>
          We take reasonable measures to help protect information about you from
          loss, theft, misuse, unauthorised access, disclosure, alteration, and
          destruction.
        </p>
        <h2>5. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{" "}
          <strong>privacy@wanderlust.example.com</strong>
        </p>
      </div>
    </div>
  );
}

/* ── Terms ── */
export function TermsPage({ onNavigate }) {
  return (
    <div className="static-doc container-narrow anim-fade-up">
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 24 }}
        onClick={() => onNavigate("home")}
      >
        ← Back
      </button>
      <h1 className="static-doc__title">Terms of Service</h1>
      <p className="static-doc__date">Last updated: January 1, 2025</p>
      <div className="static-doc__body">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Wanderlust platform, you agree to be bound
          by these Terms of Service. If you do not agree to these terms, please
          do not use our services.
        </p>
        <h2>2. Description of Service</h2>
        <p>
          Wanderlust is a platform that allows property owners to list their
          spaces for short-term rental and enables travellers to discover and
          book those spaces.
        </p>
        <h2>3. User Responsibilities</h2>
        <p>
          You are responsible for ensuring all information you provide is
          accurate and up to date. You agree not to use the platform for any
          unlawful purposes or in ways that violate these terms.
        </p>
        <h2>4. Listings</h2>
        <p>
          Property owners are solely responsible for the accuracy of their
          listings, including pricing, availability, and property descriptions.
          Wanderlust reserves the right to remove any listing that violates
          these terms.
        </p>
        <h2>5. Limitation of Liability</h2>
        <p>
          Wanderlust is not liable for any indirect, incidental, or
          consequential damages arising from your use of the platform.
        </p>
        <h2>6. Contact</h2>
        <p>
          For questions about these Terms, contact us at{" "}
          <strong>legal@wanderlust.example.com</strong>
        </p>
      </div>
    </div>
  );
}
