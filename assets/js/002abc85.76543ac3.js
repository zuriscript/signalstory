"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[427],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},g=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(r),g=a,f=u["".concat(l,".").concat(g)]||u[g]||d[g]||s;return r?n.createElement(f,o(o({ref:t},p),{},{components:r})):n.createElement(f,o({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,o=new Array(s);o[0]=g;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:a,o[1]=i;for(var c=2;c<s;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}g.displayName="MDXCreateElement"},5040:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const s={sidebar_position:7},o="Persistence",i={unversionedId:"persistence",id:"persistence",title:"Persistence",description:"signalstory provides a convenient mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the enableLocalStorageSync configuration option, you can ensure that your store's state remains persistent and readily available.",source:"@site/docs/persistence.md",sourceDirName:".",slug:"/persistence",permalink:"/signalstory/docs/persistence",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/persistence.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"History",permalink:"/signalstory/docs/history"}},l={},c=[{value:"Enabling Local Storage Persistence",id:"enabling-local-storage-persistence",level:2},{value:"Loading the Persisted State",id:"loading-the-persisted-state",level:2},{value:"Clearing the Persisted State",id:"clearing-the-persisted-state",level:2}],p={toc:c},u="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"persistence"},"Persistence"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"signalstory")," provides a convenient mechanism for persisting the state of your store, allowing you to save and load the state across different sessions or browser refreshes. By enabling the ",(0,a.kt)("inlineCode",{parentName:"p"},"enableLocalStorageSync")," configuration option, you can ensure that your store's state remains persistent and readily available."),(0,a.kt)("h2",{id:"enabling-local-storage-persistence"},"Enabling Local Storage Persistence"),(0,a.kt)("p",null,"To activate the local storage persistence feature in signalstory, you need to set the ",(0,a.kt)("inlineCode",{parentName:"p"},"enableLocalStorageSync")," option to ",(0,a.kt)("inlineCode",{parentName:"p"},"true")," in the store's configuration."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"const storeConfig: StoreConfig<TState> = {\n  // Other configuration options\n  enableLocalStorageSync: true,\n};\n")),(0,a.kt)("p",null,"Enabling local storage persistence ensures that the state of your store is automatically saved to the browser's local storage whenever it undergoes a state change. This allows you to preserve the state even when the application is closed or refreshed."),(0,a.kt)("h2",{id:"loading-the-persisted-state"},"Loading the Persisted State"),(0,a.kt)("p",null,"When your application starts up or the store is initialized, signalstory automatically loads the persisted state from the local storage, if available.\nIf a persisted state exists in the local storage, signalstory retrieves it and sets it as the initial state of your store. This ensures that your application starts with the most recent state that was saved during the previous session."),(0,a.kt)("h2",{id:"clearing-the-persisted-state"},"Clearing the Persisted State"),(0,a.kt)("p",null,"To clear the persisted state from the local storage without affecting the current state of the store, you can use:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"store.clearPersistence(); // Clears the persisted state from local storage\n")))}d.isMDXComponent=!0}}]);