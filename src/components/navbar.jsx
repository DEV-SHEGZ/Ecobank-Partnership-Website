import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import atcLogo from "../images/A.T.C.png";
import ecobankLogo from "../images/layer1 (1).png";

const links = [
  ["About", "about"],
  ["How it Works", "how-it-works"],
  ["Our Teachers", "teachers"],
  ["The Journey", "journey"],
  ["Enrol Now", "enrol"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = menuRef.current?.querySelectorAll('button, a[href]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <nav id="eco-navbar" className="navbar navbar-expand-lg bg-body-tertiary" aria-label="Main navigation">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" aria-label="Ecobank home">
          <img src={ecobankLogo} alt="Ecobank" className="eco-logo" />
        </Link>
        <button
          ref={toggleRef}
          className="navbar-toggler"
          type="button"
          aria-controls="landing-navigation"
          aria-expanded={open}
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <span className="navbar-toggler-icon" aria-hidden="true" />
        </button>
        <div ref={menuRef} className={`rmv-flx collapse navbar-collapse${open ? " show" : ""}`} id="landing-navigation">
          <button ref={closeRef} type="button" className="mobile-menu-close" aria-label="Close navigation" onClick={() => { closeMenu(); toggleRef.current?.focus(); }}>×</button>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map(([label, id]) => (
              <li key={id} className="nav-item roboto-regular">
                <a className="nav-link" href={`#${id}`} onClick={closeMenu}>{label}</a>
              </li>
            ))}
          </ul>
          <a className="mobile-start-learning" href="#enrol" onClick={closeMenu}>
            Start Learning <img src={atcLogo} alt="" />
          </a>
        </div>
        <a href="#enrol" id="start-learning-btn" className="d-flex align-items-center">
          <span className="pe-3">Start Learning</span>
          <img src={atcLogo} alt="" className="atc-logo" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
