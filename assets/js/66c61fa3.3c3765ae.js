"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[419],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},g=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),u=p(r),g=a,m=u["".concat(l,".").concat(g)]||u[g]||d[g]||s;return r?n.createElement(m,i(i({ref:t},c),{},{components:r})):n.createElement(m,i({ref:t},c))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,i=new Array(s);i[0]=g;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[u]="string"==typeof e?e:a,i[1]=o;for(var p=2;p<s;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}g.displayName="MDXCreateElement"},3397:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>o,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const s={sidebar_position:2},i="Persistence",o={unversionedId:"plugins/persistence",id:"plugins/persistence",title:"Persistence",description:"signalstory provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the StorePersistencePlugin, you can ensure that your store's state remains persistent and readily available.",source:"@site/docs/plugins/persistence.md",sourceDirName:"plugins",slug:"/plugins/persistence",permalink:"/signalstory/docs/plugins/persistence",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/plugins/persistence.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"History",permalink:"/signalstory/docs/plugins/history"},next:{title:"Store Status",permalink:"/signalstory/docs/plugins/status"}},l={},p=[{value:"Enabling Local Storage Persistence",id:"enabling-local-storage-persistence",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Loading the Persisted State",id:"loading-the-persisted-state",level:2},{value:"Clearing the Persisted State",id:"clearing-the-persisted-state",level:2}],c={toc:p},u="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"persistence"},"Persistence"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"signalstory")," provides a mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the ",(0,a.kt)("inlineCode",{parentName:"p"},"StorePersistencePlugin"),", you can ensure that your store's state remains persistent and readily available."),(0,a.kt)("h2",{id:"enabling-local-storage-persistence"},"Enabling Local Storage Persistence"),(0,a.kt)("p",null,"To activate the local storage persistence feature in signalstory, you need to include the plugin using the exposed ",(0,a.kt)("inlineCode",{parentName:"p"},"useStorePersistence")," factory method:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"class PersistedStore extends Store<MyState> {\n  constructor() {\n    super({\n        initialState: { ... },\n        name: 'My Persisted Store',\n        plugins: [\n          useStorePersistence()\n        ],\n    });\n  }\n}\n")),(0,a.kt)("p",null,"Enabling local storage persistence ensures that the state of your store is automatically saved to the browser's local storage whenever it undergoes a state change. This allows you to preserve the state even when the application is closed or refreshed."),(0,a.kt)("h2",{id:"configuration"},"Configuration"),(0,a.kt)("p",null,"You can configure the following things:"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Option"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"),(0,a.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"persistenceKey")),(0,a.kt)("td",{parentName:"tr",align:null},"The key to use for the local storage entry."),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"_persisted_state_of_<storeName>_"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"persistenceStorage")),(0,a.kt)("td",{parentName:"tr",align:null},"The storage mechanism for persistence."),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"localStorage"))))),(0,a.kt)("p",null,"And use it like:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"useStorePersistence({\n  persistenceKey: 'My-store-persistence-key',\n  persistenceStorage: MyStorageImplementation,\n});\n")),(0,a.kt)("h2",{id:"loading-the-persisted-state"},"Loading the Persisted State"),(0,a.kt)("p",null,"When your application starts up or the store is initialized, signalstory automatically loads the persisted state from the local storage, if available.\nIf a persisted state exists in the local storage, signalstory retrieves it and sets it as the initial state of your store. This ensures that your application starts with the most recent state that was saved during the previous session."),(0,a.kt)("h2",{id:"clearing-the-persisted-state"},"Clearing the Persisted State"),(0,a.kt)("p",null,"To clear the persisted state from the local storage without affecting the current state of the store, you can use:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"clearStoreStorage(store); // Clears the persisted state from storage\n")))}d.isMDXComponent=!0}}]);