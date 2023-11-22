import Navbar from '@theme-original/Navbar';
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function NavbarWrapper(props) {
  const location = useLocation();
  const isRootPath = location.pathname === '/signalstory/';
  const classTag = isRootPath ? 'landing-page-nav-sibling' : 'docs-nav-sibling';

  React.useLayoutEffect(() => {
    if (window.innerWidth < 997) {
      const checkScrollPosition = () => {
        document.body.classList.toggle('scrolling', window.scrollY > 0);
      };
      const timerId = setInterval(checkScrollPosition, 250);
      return () => clearInterval(timerId);
    }
  }, []);

  return (
    <>
      <span className={classTag}></span>
      <Navbar {...props} />
    </>
  );
}
