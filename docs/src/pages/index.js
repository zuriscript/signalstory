import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
       <div className='hero-caption'>
        <img id="hero-mobile-logo" src={useBaseUrl('/img/signalstory_no_background.png')}/>
            <h1 className="hero__title">
              <span className='big fluid'>signalstory
              </span> | Empower Your Angular State Management</h1>
            <p className="hero__subtitle">Unlock the Power of Signals: Level up your Application State</p>
            <div className={styles.buttons}>
              <Link
                id="docs-button"
                className="button button--secondary button--lg"
                to="/docs/prolog">
                Start Adventure 🧙‍♀️
              </Link>
            </div> 
        </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      description="Signal-based state management for Angular applications">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
