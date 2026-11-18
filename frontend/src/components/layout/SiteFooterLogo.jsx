import "./siteFooterLogo.css";

export default function SiteFooterLogo() {
  return (
    <footer className="site-footer-logo-wrap" aria-hidden="true">
      <div className="site-footer-logo-viewport">
        <img
          src="/images/logo-clean.png"
          alt=""
          className="site-footer-logo-img dark-only"
          loading="lazy"
        />
        <img
          src="/images/logo-clean-light.png"
          alt=""
          className="site-footer-logo-img light-only"
          loading="lazy"
        />
      </div>
    </footer>
  );
}
