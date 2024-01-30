"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[419],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>g});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(n),m=r,g=c["".concat(l,".").concat(m)]||c[m]||u[m]||o;return n?a.createElement(g,i(i({ref:t},p),{},{components:n})):a.createElement(g,i({ref:t},p))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:r,i[1]=s;for(var d=2;d<o;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3397:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>d});var a=n(7462),r=(n(7294),n(3905));const o={sidebar_position:2},i="Persistence",s={unversionedId:"plugins/persistence",id:"plugins/persistence",title:"Persistence",description:"signalstory provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes, or even creating fully offline applications using indexedDB. By enabling the StorePersistencePlugin, you can ensure that your store's state remains persistent and readily available.",source:"@site/docs/plugins/persistence.md",sourceDirName:"plugins",slug:"/plugins/persistence",permalink:"/signalstory/docs/plugins/persistence",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/plugins/persistence.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"History (Deprecated)",permalink:"/signalstory/docs/plugins/history"},next:{title:"Store Status",permalink:"/signalstory/docs/plugins/status"}},l={},d=[{value:"Enabling Local Storage Persistence",id:"enabling-local-storage-persistence",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Feature detection (SSR)",id:"feature-detection-ssr",level:2},{value:"Loading the Persisted State",id:"loading-the-persisted-state",level:2},{value:"Clearing the Persisted State",id:"clearing-the-persisted-state",level:2},{value:"IndexedDB (experimental)",id:"indexeddb-experimental",level:2},{value:"IndexedDB Configuration Options",id:"indexeddb-configuration-options",level:3},{value:"One database per store",id:"one-database-per-store",level:4},{value:"One objectstore per store",id:"one-objectstore-per-store",level:4},{value:"One objectstore for multiple stores",id:"one-objectstore-for-multiple-stores",level:4},{value:"Database Migration",id:"database-migration",level:3}],p={toc:d},c="wrapper";function u(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"persistence"},"Persistence"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"signalstory")," provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes, or even creating fully offline applications using ",(0,r.kt)("inlineCode",{parentName:"p"},"indexedDB"),". By enabling the ",(0,r.kt)("inlineCode",{parentName:"p"},"StorePersistencePlugin"),", you can ensure that your store's state remains persistent and readily available."),(0,r.kt)("p",null,"Signalstory provides both synchronous storage implementations like ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage"},"SessionStorage")," or ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"},"LocalStorage")," and asynchronos options such as ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"},"IndexedDb"),". Additionally, you have the freedom to integrate your custom implementations for both synchronous and asynchronous storages."),(0,r.kt)("h2",{id:"enabling-local-storage-persistence"},"Enabling Local Storage Persistence"),(0,r.kt)("p",null,"To activate the local storage persistence feature in signalstory, you need to include the plugin using the exposed ",(0,r.kt)("inlineCode",{parentName:"p"},"useStorePersistence")," factory method:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"class PersistedStore extends Store<MyState> {\n  constructor() {\n    super({\n        initialState: { ... },\n        name: 'My Persisted Store',\n        plugins: [\n          useStorePersistence()\n        ],\n    });\n  }\n}\n")),(0,r.kt)("h2",{id:"configuration"},"Configuration"),(0,r.kt)("p",null,"You can configure the following things, note that all properties are optional:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Option"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"),(0,r.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"persistenceKey")),(0,r.kt)("td",{parentName:"tr",align:null},"The key to use for the local storage entry."),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"_persisted_state_of_<storeName>_"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"persistenceStorage")),(0,r.kt)("td",{parentName:"tr",align:null},"The storage mechanism for persistence."),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"localStorage"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"projection")),(0,r.kt)("td",{parentName:"tr",align:null},"Projection functions applied before storing and after loading from storage. Can be useful for obfuscating sensitive data prior to storing or for saving space."),(0,r.kt)("td",{parentName:"tr",align:null},"None")))),(0,r.kt)("p",null,"To configure the Store Persistence Plugin, use it like:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"useStorePersistence({\n  persistenceKey: 'My-store-persistence-key',\n  persistenceStorage: sessionStorage,\n  projection: {\n    onWrite: state => transformedStateToBeStored,\n    onLoad: projection => transformedStateToBeApplied,\n  },\n});\n")),(0,r.kt)("h2",{id:"feature-detection-ssr"},"Feature detection (SSR)"),(0,r.kt)("p",null,"In cases where the storage providers are not available, for example for SSR, the plugin does not get registered and will not throw an error.\nHence, you can reuse your Store plugin declerations without changing anything. However, note that Angular raises an error if there's an attempt to reference unsupported global variables during SSR. To work around this, instead of using the actual window variable, simply specify the string constant ",(0,r.kt)("inlineCode",{parentName:"p"},"LOCAL_STORAGE")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"SESSION_STORAGE"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"useStorePersistence({\n  persistenceStorage: 'SESSION_STORAGE',\n});\n")),(0,r.kt)("h2",{id:"loading-the-persisted-state"},"Loading the Persisted State"),(0,r.kt)("p",null,"When your application starts up or the store is initialized, signalstory automatically loads the persisted state from the storage, if available.\nIf a persisted state exists in the storage, signalstory retrieves it and sets it as the initial state of your store. This ensures that your application starts with the most recent state that was saved during the previous session."),(0,r.kt)("h2",{id:"clearing-the-persisted-state"},"Clearing the Persisted State"),(0,r.kt)("p",null,"To clear the persisted state from storage without affecting the current state of the store, you can use:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"clearStoreStorage(store); // Clears the persisted state from storage\n")),(0,r.kt)("h2",{id:"indexeddb-experimental"},"IndexedDB (experimental)"),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"The native indexedDB adapter has undergone testing, though it has not been deployed in production code as of now. Further manual and unit tests are required before we consider removing the experimental flag. Nevertheless, feel free to dive in and start using it - The api is stable and good to go!")),(0,r.kt)("p",null,"Signalstory provides native integration for ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"},"IndexedDb"),", hence no further library is needed. Note, however, that you could also use a third-party library, if you really wanted to, by creating an adapter implementing ",(0,r.kt)("inlineCode",{parentName:"p"},"AsyncStorage")," by yourself."),(0,r.kt)("p",null,"Following configuration scenarios are possible:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"One database per store"),(0,r.kt)("li",{parentName:"ul"},"One objectstore per store"),(0,r.kt)("li",{parentName:"ul"},"One objectstore for all stores")),(0,r.kt)("p",null,"It often makes sense to choose one single approach, but if your application has other IDB databases or objectstores, you can mix and match as you wish to get the best setup possible. Other possible use cases for mixing includes clustering stores from the same feature in the same database or using the same objectStore for related stores, etc."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Using multiple objectstores for the same database needs a specialized setup, since the objectstores can only be created inside a versionchanged transaction.\nYou can use ",(0,r.kt)("a",{parentName:"p",href:"#database-migration"},"native db migrations")," to prepare you objectstores but also for applying data migration and cleanups.")),(0,r.kt)("h3",{id:"indexeddb-configuration-options"},"IndexedDB Configuration Options"),(0,r.kt)("p",null,"When configuring the connection to IndexedDB in ",(0,r.kt)("inlineCode",{parentName:"p"},"signalstory"),", you can use the following options provided by the ",(0,r.kt)("inlineCode",{parentName:"p"},"IndexedDbOptions")," interface. The ",(0,r.kt)("inlineCode",{parentName:"p"},"configureIndexedDb")," function takes these options to set up the necessary configuration for store persistence."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Option"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"),(0,r.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,r.kt)("th",{parentName:"tr",align:null},"Required"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"dbName")),(0,r.kt)("td",{parentName:"tr",align:null},"The name of the IndexedDB database."),(0,r.kt)("td",{parentName:"tr",align:null},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Yes")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"dbVersion")),(0,r.kt)("td",{parentName:"tr",align:null},"The version of the IndexedDB database. If not explicitly provided, the adapter attempts to infer the version by inspecting the pool. This inference relies on prior configuration through the ",(0,r.kt)("inlineCode",{parentName:"td"},"migrateIndexedDb")," function or previous usage of the same database."),(0,r.kt)("td",{parentName:"tr",align:null},"inference"),(0,r.kt)("td",{parentName:"tr",align:null},"No")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"objectStoreName")),(0,r.kt)("td",{parentName:"tr",align:null},"The name of the object store to connect to within the database."),(0,r.kt)("td",{parentName:"tr",align:null},"storename"),(0,r.kt)("td",{parentName:"tr",align:null},"No")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"key")),(0,r.kt)("td",{parentName:"tr",align:null},"The key to use when connecting to a specific record within the object store."),(0,r.kt)("td",{parentName:"tr",align:null},"storename"),(0,r.kt)("td",{parentName:"tr",align:null},"No")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"handlers")),(0,r.kt)("td",{parentName:"tr",align:null},"Configuration options for IndexedDB setup handlers."),(0,r.kt)("td",{parentName:"tr",align:null},"None"),(0,r.kt)("td",{parentName:"tr",align:null},"No")))),(0,r.kt)("p",null,"Example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { configureIndexedDb } from 'signalstory';\n\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'YourDatabaseName',\n    dbVersion: 1,\n    objectStoreName: 'YourObjectStoreName',\n    key: 'YourKey',\n    handlers: {\n      onSuccess: () => {\n        // Your success handler is called after successfull initialization\n      },\n      onBlocked: () => {\n        // Your blocked handler is called\n        // when an open connection to a database is blocking a versionchange transaction\n      },\n      onInitializationError: () => {\n        // Your error handler is called in the case of an initialization error\n      },\n    },\n    projection: {\n      onWrite: state => {\n        // Optional projection on write for obfuscation or to slim down the stored state\n      },\n      onLoad: projection => {\n        // If onWrite was specified, you have to tell the store how to consume the stored state\n      },\n    },\n  })\n);\n")),(0,r.kt)("h4",{id:"one-database-per-store"},"One database per store"),(0,r.kt)("p",null,"In this configuration, each store is associated with its dedicated IndexedDB database."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { configureIndexedDb } from 'signalstory';\n\n// Store A\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'StoreADatabase',\n    dbVersion: 1,\n  })\n);\n\n// Store B\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'StoreBDatabase',\n    dbVersion: 1,\n  })\n);\n")),(0,r.kt)("h4",{id:"one-objectstore-per-store"},"One objectstore per store"),(0,r.kt)("p",null,"This configuration involves creating a distinct object store within the IndexedDB database for each store. Make sure that each plugin is using the same database name.\nIt is recommended to use ",(0,r.kt)("a",{parentName:"p",href:"#database-migration"},"db migrations")," to establish the idb structure. An additional advantage of using the migration feature is the automatic setup of a database pool, allowing the required database version to be auto-detected."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { configureIndexedDb } from 'signalstory';\n\n// Store A\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'SharedDatabase',\n  })\n);\n\n// Store B\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'SharedDatabase',\n  })\n);\n")),(0,r.kt)("h4",{id:"one-objectstore-for-multiple-stores"},"One objectstore for multiple stores"),(0,r.kt)("p",null,"Here, a single object store is shared among all stores within the IndexedDB database. If you are using ",(0,r.kt)("a",{parentName:"p",href:"#database-migration"},"db migrations"),", you also don't have to specify the database version."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { configureIndexedDb } from 'signalstory';\n\n// Store A\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'SharedDatabase',\n    dbVersion: 1,\n    objectStoreName: 'SharedObjectStore',\n  })\n);\n\n// Store B\nuseStorePersistence(\n  configureIndexedDb({\n    dbName: 'SharedDatabase',\n    dbVersion: 1,\n    objectStoreName: 'SharedObjectStore',\n  })\n);\n")),(0,r.kt)("h3",{id:"database-migration"},"Database Migration"),(0,r.kt)("p",null,"When setting up ",(0,r.kt)("inlineCode",{parentName:"p"},"signalstory")," with IndexedDB, database migration becomes essential for managing schema changes, applying data migrations, and performing cleanups. The ",(0,r.kt)("inlineCode",{parentName:"p"},"migrateIndexedDb")," function allows you to define and execute these migrations. This will also setup a database pool, which makes the configuration at the stores simpler."),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"migrateIndexedDb")," has to be called for all used databases individually and should be called before the first store is used. One possible approach is to use the ",(0,r.kt)("a",{parentName:"p",href:"https://angular.io/api/core/APP_INITIALIZER"},(0,r.kt)("inlineCode",{parentName:"a"},"APP_INITIALIZER"))," DI token to register migrations. It's important to note that migrations are registered lazily and will only be applied during the first usage of the database."),(0,r.kt)("p",null,"Here's an example of using ",(0,r.kt)("inlineCode",{parentName:"p"},"migrateIndexedDb")," to configure the IndexedDB database with store registrations and migration operations."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// Somewhere very early in the application\nidbMigration();\n\n// idbMigration.ts\nimport { migrateIndexedDb } from 'signalstory';\n\nconst idbMigration = () => {\n  migrateIndexedDb('MyApplicationDb', 5, model =>\n    model\n      .createStore('StoreA')\n      .createStoreOrClearState('StoreB')\n      .createStoreOrTransform('StoreC', (oldVersion, state) => {\n        if (oldVersion > 3) {\n          return myMigrationLogicForStoreA(state);\n        } else {\n          return myVeryOldMigrationLogicForStoreA(state);\n        }\n      })\n      .dropStore('StoreD')\n      .createStoreOrMigrateRecords('SharedObjectStore', records =>\n        records\n          .createStoreOrClearState('StoreX')\n          .createStoreOrTransform('StoreY', (oldVersion, state) => {\n            return myMigrationLogicForStoreY(state);\n          })\n          .dropStore('StoreZ')\n      )\n  );\n};\n")),(0,r.kt)("p",null,"In this example, the migration is applied if:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The user doesn't have an IDB database named ",(0,r.kt)("em",{parentName:"li"},"MyApplicationDb")," in their browser storage."),(0,r.kt)("li",{parentName:"ul"},"The user has an IDB database named ",(0,r.kt)("em",{parentName:"li"},"MyApplicationDb"),", but with a version smaller than 5.")),(0,r.kt)("p",null,"The migration operations:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"createStore")," creates an object store if it doesn't exist. It's crucial to list all the object stores you're using here, unless you've registered them through another operation below."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"createStoreOrClearState")," creates an object store or clears its current state."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"createStoreOrTransform")," creates an object store or applies a custom transformation (data migration) on the existing state."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"createStoreOrMigrateRecords")," creates an object store or migrates its records using the specified migration logic. This is only useful, if you are using a ",(0,r.kt)("em",{parentName:"li"},"single-objectstore-for-multiple-stores")," approach and you have to migrate stores on a record level."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"dropStore")," deletes an object store if it exists.")))}u.isMDXComponent=!0}}]);