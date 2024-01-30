---
sidebar_position: 1
---

# Prolog

In every frontend app, there's state to manage. State management is about organizing data, whether it's UI-centric or related to business/domain, and linking it with the view. Beyond sharing state bewteen components and services, various patterns and architectural styles exist. The key is selecting the right architecture for your needs and sticking with it. Architectures should bring readability and predictability, making your code easy to maintain and scale.

:::tip
Starting out? You can keep it nice and simple if you prefer to avoid exploring all the advanced features that a state management library can offer! Begin by checking out the [store](./store.md), and only dive into the rest if you're curious later on.
:::

### Why a new state management library?

State management is hard and the right approach is highly dependent on your project and your team. There's no one-size-fits-all solution, and that's why many established libraries exist.

What sets signalstory apart from many other solutions is its use of [Angular signals](https://angular.io/guide/signals) as native unit for state. Signalstory adopts an object-oriented approach and is built around an imperative setup. However, when the need arises, it is possible to leverage decoupling features, enabling the application to communicate through events and therefore enabling loose coupling between different parts.

> Having used multiple libraries and architectures in the past, I envisioned signalstory to be very simple to use. It should provide an enjoyable user experience for developers, whether junior or senior, while incorporating all the features you need to master your frontend state requirements. At its core, signalstory imposes as few restrictions as possible, providing a toolbox of utilities and concepts to spark creativity.

### Let the store grow with your project

import ThemedImage from '@theme/ThemedImage';
import { useWindowSize } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

<ThemedImage
alt="Code Hero image"
sources={{
    light: useBaseUrl(
      useWindowSize() === 'mobile'
        ? '/img/code_evolve_portrait_light.png'
        : '/img/code_evolve_landscape_light.png'
    ),
    dark: useBaseUrl(
      useWindowSize() === 'mobile'
        ? '/img/code_evolve_portrait_dark.png'
        : '/img/code_evolve_landscape_dark.png'
    ),
  }}
/>

### How does it scale?

In signalstory, think of a `store` as a `signal-in-a-service`. Start by establishing a store dedicated to a domain entity, a component, or both. Hence, state is distributed across multiple stores but can also be partially kept at the component level.  
And then:

<ul style={{ listStyleType: 'none', paddingLeft: useWindowSize() === 'mobile' ? '0em' : '1em' }}>
  <li style={{ marginBottom: '0.5em' }}>🚀 Use class methods to provide controlled access and mutations to shared state.</li>
  <li style={{ marginBottom: '0.5em' }}>🌌 If your store becomes too complex and bloated, slice it into multiple stores.</li>
  <li style={{ marginBottom: '0.5em' }}>✨ Join and aggregate your state at the component level using signal mechanics.</li>
  <li style={{ marginBottom: '0.5em' }}>🌐 Need to sync states between stores synchronously? - Use events.</li>
  <li style={{ marginBottom: '0.5em' }}>🔮 Need to decouple actors and consumers as you do in redux? - Use events.</li>
  <li style={{ marginBottom: '0.5em' }}>🔄 Craving Immutability? - Just activate it.</li>
  <li style={{ marginBottom: '0.5em' }}>🏎️ Don't want full immutability because your store has to be super fast? - Don't activate it.</li>
  <li style={{ marginBottom: '0.5em' }}>🧙‍♂️ Seeking a way to encapsulate side effects in a reusable, maintainable, and testable way? - Use effect objects.</li>
  <li style={{ marginBottom: '0.5em' }}>🔍 Want a way to reuse and test queries spanning over multiple stores? - Use query objects.</li>
  <li style={{ marginBottom: '0.5em' }}>📦 Don't want to use a class for stores? - You don't have to.</li>
  <li style={{ marginBottom: '0.5em' }}>🛠️ Tired of debugging state changes in the console? - Enable redux devtools.</li>
  <li style={{ marginBottom: '0.5em' }}>🪄 Still want some good old logging magic? - Enable Store logger plugin</li>
  <li style={{ marginBottom: '0.5em' }}>⏳ Need to keep track of store history and perform undo/redo operations? - track history.</li>
  <li style={{ marginBottom: '0.5em' }}>💾 Want to sync your state with local storage? - Enable the persistence plugin.</li>
  <li style={{ marginBottom: '0.5em' }}>🗄️ Need a more sophisticated store storage or building an offline app? - Use IndexedDB adapter.</li>
  <li style={{ marginBottom: '0.5em' }}>📈 Need to get notified of whether your store is modified or currently loading? - Enable the Store Status plugin.</li>
  <li style={{ marginBottom: '0.5em' }}>📊 Wondering where your bottlenecks are? - Enable the performance counter plugin.</li>
  <li style={{ marginBottom: '0.5em' }}>🎨 Something's missing? - Write a custom plugin.</li>
</ul>
