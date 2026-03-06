import "./Footer.css";

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <div className="footer__logo">
            {/* <span className="footer__logo-pin">⌂</span> */}
            Wanderlust
          </div>
          <p className="footer__tagline">
            Find your perfect escape, anywhere in the world.
          </p>
        </div>

        <div className="footer__col">
          <span className="footer__col-title">Explore</span>
          <button className="footer__link" onClick={() => onNavigate("home")}>
            All Listings
          </button>
          <button className="footer__link" onClick={() => onNavigate("new")}>
            List Your Space
          </button>
        </div>

        <div className="footer__col">
          <span className="footer__col-title">Company</span>
          <button
            className="footer__link"
            onClick={() => onNavigate("privacy")}
          >
            Privacy Policy
          </button>
          <button className="footer__link" onClick={() => onNavigate("terms")}>
            Terms of Service
          </button>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          © {new Date().getFullYear()} Wanderlust · All rights reserved
        </div>
      </div>
    </footer>
  );
}
