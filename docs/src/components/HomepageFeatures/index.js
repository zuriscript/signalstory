import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Signal-Based State Management',
    Svg: require('@site/static/img/magic.png').default,
    description: (
      <>
        Utilizes a signal-based approach to state management. This eliminates
        the need for asynchronous observables in components and templates for
        the most part.
      </>
    ),
  },
  {
    title: 'Event Driven',
    Svg: require('@site/static/img/pumpkin-carriage.png').default,
    description: (
      <>
        Supports event handling, enabling decoupled communication and
        interaction between different stores as well as providing the
        possibility to react synchronously to events.
      </>
    ),
  },
  {
    title: 'Open Architecture',
    Svg: require('@site/static/img/castle.png').default,
    description: (
      <>
        Offers an open architecture: You can stay completely imperative or make
        use of declerative decoupling features; you can use plain
        repository-based stores or mimicking Redux-like behavior depending on
        your needs and preferences.
      </>
    ),
  },
  {
    title: 'Flexible Side Effect Execution',
    Svg: require('@site/static/img/magic-wand.png').default,
    description: (
      <>
        Apart from embedded store methods and companion services, side effects
        can be managed using encapsulated effect objects, ensuring modular,
        cleaner and more testable code.
      </>
    ),
  },
  {
    title: 'Automatic Persistence',
    Svg: require('@site/static/img/scroll.png').default,
    description: (
      <>
        Provides automatic persistence of store state to local storage. Any
        changes made to the store are automatically synchronized with local
        storage, ensuring that the state is preserved across page reloads.
      </>
    ),
  },
  {
    title: 'State History',
    Svg: require('@site/static/img/spellbook.png').default,
    description: (
      <>
        You can activate store history to trace state changes over time and
        execute undo and redo operations. Keep your backend informed about the
        sequence of events in the case of an error.
      </>
    ),
  },
  {
    title: 'Support for Redux devtools',
    Svg: require('@site/static/img/excalibur.png').default,
    description: (
      <>
        Dive deep into the history of state changes, visualize the flow of
        actions, and effortlessly debug your application using the Redux
        Devtools
      </>
    ),
  },
  {
    title: 'Immutability',
    Svg: require('@site/static/img/frozen-hourglass.png').default,
    description: (
      <>
        In contrast to native signals, immutability becomes a choice,
        safeguarding your state against accidental mutations and offering more
        predictability and simplified debugging.
      </>
    ),
  },
  {
    title: 'Tree shakeable',
    Svg: require('@site/static/img/forest.png').default,
    description: (
      <>
        Leveraging a plugin architecture, optional features are only then part
        of your bundle if you choose to use them. Custom plugins are a few lines
        of code away.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={Svg} />
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
