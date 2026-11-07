import { DownloadIcon, NameMark, Underline } from "./ink";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => (
  <header className="site-container site-header">
    <a href="#main" className="site-logo" aria-label="Toluwalope Adegoke, back to top">
      <NameMark className="site-logo-mark" />
    </a>

    <nav className="site-nav" aria-label="Main">
      {/* Inline on wider screens; on phones these move into MobileMenu. */}
      <div className="site-nav-links">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} className="site-nav-link">
            {link.label}
            <Underline className="site-nav-underline" />
          </a>
        ))}
        <a
          href="/resume.pdf"
          className="site-nav-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
          <DownloadIcon className="site-header-icon" />
        </a>
      </div>
      <ThemeToggle />
      <MobileMenu links={LINKS} />
    </nav>
  </header>
);

export default Header;
