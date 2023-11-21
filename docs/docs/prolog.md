---
sidebar_position: 1
---

# Prolog

Every frontend application has state. Therefore, state management is the process of organizing data, be it strictly UI-related or business/domain-related, and connecting it with the view. Apart from sharing state between components and services, there are many other different patterns and architectural styles. However, what matters most is choosing the right architecture for your requirements and being consistent with it. Architectures should bring readability and predictability to your code, making it easy to maintain and scale.

### Why a new state management library?

State management is hard and the right approach is highly dependent on your project and, especially, your team. There's no one-size-fits-all solution, and that's why many established libraries exist.

What sets signalstory apart from many other solutions is its use of [Angular signals](https://angular.io/guide/signals) as native unit for state. Therefore, there is no intention for signalstory to be employed outside of the Angular framework, which in return facilitates the integration of the implementation with the Angular ecosystem from the ground up. Signalstory adopts an object-oriented approach and is built around an imperative setup. However, when the need arises, it is possible to leverage decoupling features, enabling the application to communicate through events and therefore enabling loose coupling between different parts.

> Having used multiple libraries and architectures in the past, I envisioned signalstory to be very simple to use. It should provide an enjoyable user experience for developers of all levels, whether junior or senior, while incorporating enough features to handle most practical use cases. At its core, signalstory imposes as few restrictions as possible, providing a toolbox of utilities and concepts to spark creativity.

### How does it scale?

Start by establishing a `store` dedicated to a domain entity, a component, or both. In signalstory, think of a `store` as a `signal-in-a-service`. State is distributed across multiple stores but can also be partially kept at the component level. Then:

- Use class methods to provide controlled access and mutations to shared state.
- If your store becomes unwieldy, slice it into multiple stores.
- Join and aggregate your state at the component level using signal mechanics.
- Need to sync states between stores? - Use events.
- Need to decouple actors and consumers as you do in redux? - Use events.
- Craving Immutability? - Just activate it.
- Seeking a way to encapsulate side effects in a reusable, maintainable, and testable way? - Use effect objects.
- Want a way to reuse and test queries spanning over multiple stores? - Use query objects.
- Need to keep track of store history and selectively perform undo/redo operations? - Enable the history plugin.
- Want to sync your state with local storage? - Enable the persistence plugin.
- If something's missing? - Write a custom plugin.
- Read the docs for more features and concepts
