"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[312],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=l(n),d=a,f=u["".concat(p,".").concat(d)]||u[d]||h[d]||s;return n?r.createElement(f,o(o({ref:t},c),{},{components:n})):r.createElement(f,o({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=d;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[u]="string"==typeof e?e:a,o[1]=i;for(var l=2;l<s;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3083:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>i,toc:()=>l});var r=n(7462),a=(n(7294),n(3905));const s={sidebar_position:8},o="State Snapshot",i={unversionedId:"state-snapshot",id:"state-snapshot",title:"State Snapshot",description:"The snapshot feature enables you to capture and restore the state of all stores currently in scope or a selected subset of stores within your application. This can be particularly useful for scenarios where you need to save and later revert application state, such as when performing a rollback or in response to user actions.",source:"@site/docs/state-snapshot.md",sourceDirName:".",slug:"/state-snapshot",permalink:"/signalstory/docs/state-snapshot",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/state-snapshot.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"Local state",permalink:"/signalstory/docs/local-state"},next:{title:"Testing",permalink:"/signalstory/docs/testing"}},p={},l=[{value:"Usage",id:"usage",level:2},{value:"Snapshot Creation",id:"snapshot-creation",level:3},{value:"Snapshot Restoration",id:"snapshot-restoration",level:3}],c={toc:l},u="wrapper";function h(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"state-snapshot"},"State Snapshot"),(0,a.kt)("p",null,"The snapshot feature enables you to capture and restore the state of all stores currently in scope or a selected subset of stores within your application. This can be particularly useful for scenarios where you need to save and later revert application state, such as when performing a rollback or in response to user actions."),(0,a.kt)("p",null,"While the ",(0,a.kt)("a",{parentName:"p",href:"/signalstory/docs/plugins/history"},"history plugin")," effectively captures the history of one store, a snapshot allows you to ",(0,a.kt)("strong",{parentName:"p"},"rollback multiple actions across various stores.")," Using snapshots you can provide transactional guarantees spanning the full application state."),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"A snapshot is a representation of the application state at a specific point in time. It includes a timestamp indicating when the snapshot was created and a ",(0,a.kt)("inlineCode",{parentName:"p"},"restore")," method to revert the application state to the captured snapshot."),(0,a.kt)("h3",{id:"snapshot-creation"},"Snapshot Creation"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"createSnapshot")," function is used to generate a state snapshot. It accepts a variable number of store instances or store class types as parameters. If no stores are provided, the snapshot will include all stores."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createSnapshot } from 'signalstory';\n\n// Capture all stores\nconst snapshot1 = createSnapshot();\n\n// You can use the store class types\nconst snapshot2 = createSnapshot(BookStore, UserStore);\n\n// You can use store instances\nconst store1 = new Store<string>({ initialState: '' });\nconst store2 = new Store<string>({ initialState: '' });\nconst snapshot3 = createSnapshot(store1, store2);\n\n// Or mix\nconst snapshot4 = createSnapshot(store1, BookStore);\n")),(0,a.kt)("h3",{id:"snapshot-restoration"},"Snapshot Restoration"),(0,a.kt)("p",null,"To restore the application state to a specific snapshot, call the ",(0,a.kt)("inlineCode",{parentName:"p"},"restore")," method on the created snapshot. All captured stores will rollback their respective state. The snapshot can be reused and is destroyed only when garbage collected."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"snapshot.restore();\n")))}h.isMDXComponent=!0}}]);