---
sidebar_position: 1
---

# Prolog

In the ever-evolving landscape of state management, developers have been confronted with the challenge of effectively managing state. Over time, various techniques based on local state, singletons, and services have been explored to tackle this challenge. However, as applications grow in complexity, these approaches have revealed limitations in terms of scalability, testability, and code organization.

To address these challenges, a myriad of options have emerged. Established libraries like [observable-store](https://github.com/DanWahlin/Observable-Store), [ngxs](https://www.ngxs.io/), [ngrx](https://ngrx.io/) and [akita](https://opensource.salesforce.com/akita/) have provided developers with battle-tested solutions and innovative concepts.

Meet `signalstory`, a new protagonist entering the realm of state management. In this dynamic environment filled with numerous options, you may wonder why you should consider exploring this library. Here's why:

- signalstory harnesses the power of [Angular Signals](https://angular.io/guide/signals), offering signals as native unit for state. It is one of the first libraries to embrace this brand new Angular feature, which is said to take over the world by storm.
- Similar to other libraries, signalstory adopts a multi-store approach, empowering you to divide and conquer the state domain within your Angular application. Addtionally, it provides means to combine all those scattered store instances using joint queries and effects in a reusable and testable fashion
- No two projects are the same; hence signalstory aims to put as few restrictions as possible, while providing you a toolbox of utilities and ideas to unleash your creativity. Build the state management assisted solution that perfectly aligns with your unique needs.
- You can opt for a fully imperative setup, where you're in control of every twist and turn in your state management journey. Just straightforward, imperative code that gets the job done.
- When the need arises, you can seamlessly apply decoupling features, allowing your application to communicate through events and enabling loose coupling between different parts of your state management ecosystem.

Embrace the next chapter of your state management adventure with `signalstory`.
