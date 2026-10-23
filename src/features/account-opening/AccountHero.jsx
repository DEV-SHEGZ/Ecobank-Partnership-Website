import { useEffect, useRef } from 'react';
import desktopHero from '../../images/account/hero-desktop.svg';
import mirror from '../../images/account/hero-mirror.svg';
import family from '../../images/account/hero-family.svg';
import floor from '../../images/account/hero-floor.svg';

export default function AccountHero() {
  const mirrorViewport = useRef(null);
  useEffect(() => {
    const node = mirrorViewport.current;
    // The mobile frame starts 147px into the mirror at a 430px viewport.
    let previousWidth = 0;
    const observer = new ResizeObserver(() => {
      const width = node.clientWidth;
      if (!width) return;
      node.scrollLeft = previousWidth
        ? node.scrollLeft * width / previousWidth
        : width * 147 / 430;
      previousWidth = width;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <section className="account-hero" aria-label="Building your child’s future">
    <img className="account-hero-desktop" src={desktopHero} width="1440" height="820"
      alt="A family looks into a mirror showing children banking, playing chess, using a laptop, and painting." fetchPriority="high" />
    <div className="account-hero-mobile">
      <p id="account-mirror-help" className="account-visually-hidden">Swipe horizontally, or use the left and right arrow keys, to explore the children’s activities in the mirror.</p>
      <div className="account-mirror-scroll" ref={mirrorViewport} tabIndex={0} role="region"
        aria-label="Children’s future activities" aria-describedby="account-mirror-help">
        <img src={mirror} width="1182" height="569" alt="Children banking, playing chess, using a laptop, and painting." />
      </div>
      <img className="account-hero-floor" src={floor} width="430" height="193" alt="" />
      <img className="account-hero-family" src={family} width="322" height="490" alt="A family watching the children’s activities." />
    </div>
  </section>;
}
