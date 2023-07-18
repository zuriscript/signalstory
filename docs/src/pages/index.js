import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
              <span className='fluid'>signalstory
              </span> | Empower Your Angular State Management</h1>
            <p className="hero__subtitle">Enter the Realm of stored Signals, Embark on a Data-driven Adventure with signalstory, Your Lightweight Backpack</p>
            <div className={styles.buttons}>
              <Link
                id="docs-button"
                className="button button--secondary button--lg"
                to="/docs/prolog">
                Every odyssey starts at the docs 🧭
              </Link>
            </div> 
        </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
