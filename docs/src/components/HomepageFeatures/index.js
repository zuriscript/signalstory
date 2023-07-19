import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Signal-Based State Management',
    Svg: require('@site/static/img/magic.png').default,
    description: (
      <>
        Utilizes a signal-based approach to state management. This eliminates the need for asynchronous observables in components 
        and templates (except for side effects), making the state management process more streamlined.
      </>
    ),
  },
  {
    title: 'Event Driven',
    Svg: require('@site/static/img/pumpkin-carriage.png').default,
    description: (
      <>
        Supports event handling, enabling communication and interaction between different stores. 
        Events can be used for inter-store communication or for triggering side effects.
      </>
    ),
  },
  {
    title: 'Open Architecture',
    Svg: require('@site/static/img/castle.png').default,
    description: (
      <>
      Offers an open architecture, allowing you to choose between different styles of store implementations. 
      You can use plain repository-based stores or even mimicking Redux-like behavior depending on your needs and preferences.
      </>
    ),
  },
  {
    title: 'Flexible Side Effect Execution',
    Svg: require('@site/static/img/magic-wand.png').default,
    description: (
      <>
      Side effects can be implemented in different ways in signalstory. You have the option to include side effects directly as part 
      of the store, use service-based side effects, or execute effects imperatively on the store based on your specific requirements.
      </>
    ),
  },
  {
    title: 'Automatic Persistence to Local Storage',
    Svg: require('@site/static/img/scroll.png').default,
    description: (
      <>
      Provides automatic persistence of store state to local storage. Any changes made to the store are automatically synchronized with 
      local storage, ensuring that the state is preserved across page reloads.
      </>
    ),
  },
  {
    title: 'State History',
    Svg: require('@site/static/img/spellbook.png').default,
    description: (
      <>
      You can enable store history to track state changes over time and perform undo and redo operations.
      </>
    ),
  },
];



function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} src={Svg}/>
      </div>
      <div className="color-black text--center padding-horiz--md">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={clsx('background-yellow', styles.feautures)}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
