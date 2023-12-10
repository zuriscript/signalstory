"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[53],{1109:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"noIndex":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"tutorialSidebar":[{"type":"link","label":"Prolog","href":"/signalstory/docs/prolog","docId":"prolog"},{"type":"link","label":"Installation","href":"/signalstory/docs/installation","docId":"installation"},{"type":"link","label":"Store","href":"/signalstory/docs/store","docId":"store"},{"type":"link","label":"Configuration","href":"/signalstory/docs/configuration","docId":"configuration"},{"type":"link","label":"Immutable Store","href":"/signalstory/docs/immutable-store","docId":"immutable-store"},{"type":"category","label":"Building Blocks","collapsible":true,"collapsed":false,"items":[{"type":"link","label":"Query","href":"/signalstory/docs/building-blocks/query","docId":"building-blocks/query"},{"type":"link","label":"Command","href":"/signalstory/docs/building-blocks/command","docId":"building-blocks/command"},{"type":"link","label":"Effect","href":"/signalstory/docs/building-blocks/effect","docId":"building-blocks/effect"},{"type":"link","label":"Event","href":"/signalstory/docs/building-blocks/event","docId":"building-blocks/event"}],"href":"/signalstory/docs/category/building-blocks"},{"type":"link","label":"Local state","href":"/signalstory/docs/local-state","docId":"local-state"},{"type":"link","label":"Testing","href":"/signalstory/docs/testing","docId":"testing"},{"type":"category","label":"Plugins","collapsible":true,"collapsed":false,"items":[{"type":"link","label":"History","href":"/signalstory/docs/plugins/history","docId":"plugins/history"},{"type":"link","label":"Persistence","href":"/signalstory/docs/plugins/persistence","docId":"plugins/persistence"},{"type":"link","label":"Store Status","href":"/signalstory/docs/plugins/status","docId":"plugins/status"},{"type":"link","label":"Deep Freeze","href":"/signalstory/docs/plugins/deep-freeze","docId":"plugins/deep-freeze"},{"type":"link","label":"DevTools","href":"/signalstory/docs/plugins/devtools","docId":"plugins/devtools"},{"type":"link","label":"Logger","href":"/signalstory/docs/plugins/logger","docId":"plugins/logger"},{"type":"link","label":"Custom","href":"/signalstory/docs/plugins/custom-plugin","docId":"plugins/custom-plugin"}],"href":"/signalstory/docs/category/plugins"}]},"docs":{"building-blocks/command":{"id":"building-blocks/command","title":"Command","description":"Commands are the only actions that should modify the state of a store. The store base class offers the functions set, update, and mutate to perform state modifications. They are based on the native signal modification functions.","sidebar":"tutorialSidebar"},"building-blocks/effect":{"id":"building-blocks/effect","title":"Effect","description":"While commands and queries focus exclusively on the store without involving other services or components, effects are intended to enable store interaction with services from outside. Typically, effects come into play when dealing with asynchronous operations, such as executing HTTP calls, that either modify or retrieve information from the store\'s state.","sidebar":"tutorialSidebar"},"building-blocks/event":{"id":"building-blocks/event","title":"Event","description":"By utilizing events and event handlers, you can establish communication between stores, propagate side effect results, and coordinate actions across different parts of your application. This decoupled approach enables a more modular and flexible architecture, allowing for better maintainability and extensibility of your Angular application.","sidebar":"tutorialSidebar"},"building-blocks/query":{"id":"building-blocks/query","title":"Query","description":"Queries are used to retrieve data from the store. They represent read-only operations that fetch specific information from the state and make it available for consumption in other parts of the application.","sidebar":"tutorialSidebar"},"configuration":{"id":"configuration","title":"Configuration","description":"The store configuration allows you to customize the behavior of your store upon creation. Therefore, the configuration is applied by passing it to the constructor. Since signalstory is a multi store state management library, each store can have its own configuration.","sidebar":"tutorialSidebar"},"immutable-store":{"id":"immutable-store","title":"Immutable Store","description":"Immutability means that every modification of an object creates a new one while leaving the original untouched. In the angular community, it has gained attention, particularly when combined with the OnPush change detection strategy. With this strategy, the change detection algorithm doesn\'t need to inspect the entire object and its properties for changes; instead, it can focus on checking if the reference has changed, meaning that a new object has been created and passed to the component. This clearly boosts application performance, considering the recurring and resource-intensive nature of the change detection process.","sidebar":"tutorialSidebar"},"installation":{"id":"installation","title":"Installation","description":"signalstory is based on signal, and hence requires at least angular 16.0","sidebar":"tutorialSidebar"},"local-state":{"id":"local-state","title":"Local state","description":"State management becomes even more challenging when dealing with the combination of domain data and UI-related state. This is a common scenario in modern web applications, where data fetched from backend services needs to be presented and interacted with in the user interface.","sidebar":"tutorialSidebar"},"plugins/custom-plugin":{"id":"plugins/custom-plugin","title":"Custom","description":"Custom plugins allow you to integrate additional behaviors to stores. You can design plugins that perform targeted tasks, integrating external services, validating inputs, or enhancing data management in any other way. This flexibility ensures that your store aligns perfectly with your application\'s unique use cases.","sidebar":"tutorialSidebar"},"plugins/deep-freeze":{"id":"plugins/deep-freeze","title":"Deep Freeze","description":"TypeScript\'s type system cannot prevent violations of readonly -and hence Immutable constraints in certain scenarios, such as:","sidebar":"tutorialSidebar"},"plugins/devtools":{"id":"plugins/devtools","title":"DevTools","description":"Enhance your store\'s monitoring and debugging capabilities by leveraging the DevTools plugin in signalstory which integrates your store with the Redux DevTools browser extensions, enabling you to closely observe and analyze state changes.","sidebar":"tutorialSidebar"},"plugins/history":{"id":"plugins/history","title":"History","description":"signalstory provides a convenient way for consumers to access and navigate the state history of a store. By enabling the StoreHistoryPlugin, you can use undo and redo functionality and gain insights into the sequence of actions that have occurred within your application.","sidebar":"tutorialSidebar"},"plugins/logger":{"id":"plugins/logger","title":"Logger","description":"Use the Logger plugin for the logging of crucial events related to the state management of your store. By enabling the LoggerPlugin, you can gain insights into store initialization, command execution, and effect execution.","sidebar":"tutorialSidebar"},"plugins/persistence":{"id":"plugins/persistence","title":"Persistence","description":"signalstory provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the StorePersistencePlugin, you can ensure that your store\'s state remains persistent and readily available.","sidebar":"tutorialSidebar"},"plugins/status":{"id":"plugins/status","title":"Store Status","description":"Enable your store to track the loading and modification status. By utilizing the StoreStatusPlugin, you can monitor whether your store is currently loading (running an effect) and if it has been modified.","sidebar":"tutorialSidebar"},"prolog":{"id":"prolog","title":"Prolog","description":"In every frontend app, there\'s state to manage. State management is about organizing data, whether it\'s UI-centric or related to business/domain, and linking it with the view. Beyond sharing state bewteen components and services, various patterns and architectural styles exist. The key is selecting the right architecture for your needs and sticking with it. Architectures should bring readability and predictability, making your code easy to maintain and scale.","sidebar":"tutorialSidebar"},"store":{"id":"store","title":"Store","description":"Stores serve as a central hub for managing a specific slice of the application\'s state. A store may be used globally but can also be scoped at a component or service level. Rather than using a single store for the entire application, the state can be distributed across multiple isolated stores. Each store could be responsible for managing state related to a specific domain entity or a feature.","sidebar":"tutorialSidebar"},"testing":{"id":"testing","title":"Testing","description":"Stores are injectable services and can be unit-tested in isolation, much like any other service. You can directly instantiate a store class or use TestBed if your store class has dependencies and you prefer managing them within an injection context during tests. While services can often be tested unmocked as part of the component, it\'s highly beneficial to conduct unit tests on the store in isolation.","sidebar":"tutorialSidebar"}}}')}}]);