import React from 'react';
import Navbar from '@theme-original/Navbar';
import { useLocation } from 'react-router-dom';

export default function NavbarWrapper(props) {
  const location = useLocation();
  const isRootPath = location.pathname === '/signalstory/';
  const classTag = isRootPath ? 'landing-page-nav-sibling' : 'docs-nav-sibling';

  return (
    <>
      <span className={classTag}></span>
      <Navbar {...props} />
    </>
  );
}
