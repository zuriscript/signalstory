"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[896],{3905:(e,t,o)=>{o.d(t,{Zo:()=>d,kt:()=>g});var n=o(7294);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function s(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},d=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},m="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),m=c(o),u=r,g=m["".concat(l,".").concat(u)]||m[u]||p[u]||a;return o?n.createElement(g,i(i({ref:t},d),{},{components:o})):n.createElement(g,i({ref:t},d))}));function g(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=o.length,i=new Array(a);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[m]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=o[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,o)}u.displayName="MDXCreateElement"},2758:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>m,contentTitle:()=>c,default:()=>y,frontMatter:()=>l,metadata:()=>d,toc:()=>p});var n=o(7462),r=(o(7294),o(3905)),a=o(941),i=o(7524),s=o(4996);const l={sidebar_position:1},c="Prolog",d={unversionedId:"prolog",id:"prolog",title:"Prolog",description:"In every frontend app, there's state to manage. State management is about organizing data, whether it's UI-centric or related to business/domain, and linking it with the view. Beyond sharing state bewteen components and services, various patterns and architectural styles exist. The key is selecting the right architecture for your needs and sticking with it. Architectures should bring readability and predictability, making your code easy to maintain and scale.",source:"@site/docs/prolog.md",sourceDirName:".",slug:"/prolog",permalink:"/signalstory/docs/prolog",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/prolog.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Installation",permalink:"/signalstory/docs/installation"}},m={},p=[{value:"Why a new state management library?",id:"why-a-new-state-management-library",level:3},{value:"Let the store grow with your project",id:"let-the-store-grow-with-your-project",level:3},{value:"How does it scale?",id:"how-does-it-scale",level:3}],u={toc:p},g="wrapper";function y(e){let{components:t,...o}=e;return(0,r.kt)(g,(0,n.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"prolog"},"Prolog"),(0,r.kt)("p",null,"In every frontend app, there's state to manage. State management is about organizing data, whether it's UI-centric or related to business/domain, and linking it with the view. Beyond sharing state bewteen components and services, various patterns and architectural styles exist. The key is selecting the right architecture for your needs and sticking with it. Architectures should bring readability and predictability, making your code easy to maintain and scale."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Starting out? You can keep it nice and simple if you prefer to avoid exploring all the advanced features that a state management library can offer! Begin by checking out the ",(0,r.kt)("a",{parentName:"p",href:"/signalstory/docs/store"},"store"),", and only dive into the rest if you're curious later on.")),(0,r.kt)("h3",{id:"why-a-new-state-management-library"},"Why a new state management library?"),(0,r.kt)("p",null,"State management is hard and the right approach is highly dependent on your project and your team. There's no one-size-fits-all solution, and that's why many established libraries exist."),(0,r.kt)("p",null,"What sets signalstory apart from many other solutions is its use of ",(0,r.kt)("a",{parentName:"p",href:"https://angular.io/guide/signals"},"Angular signals")," as native unit for state. Signalstory adopts an object-oriented approach and is built around an imperative setup. However, when the need arises, it is possible to leverage decoupling features, enabling the application to communicate through events and therefore enabling loose coupling between different parts."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Having used multiple libraries and architectures in the past, I envisioned signalstory to be very simple to use. It should provide an enjoyable user experience for developers, whether junior or senior, while incorporating all the features you need to master your frontend state requirements. At its core, signalstory imposes as few restrictions as possible, providing a toolbox of utilities and concepts to spark creativity.")),(0,r.kt)("h3",{id:"let-the-store-grow-with-your-project"},"Let the store grow with your project"),(0,r.kt)(a.Z,{alt:"Code Hero image",sources:{light:(0,s.Z)("mobile"===(0,i.i)()?"/img/code_evolve_portrait_light.png":"/img/code_evolve_landscape_light.png"),dark:(0,s.Z)("mobile"===(0,i.i)()?"/img/code_evolve_portrait_dark.png":"/img/code_evolve_landscape_dark.png")},mdxType:"ThemedImage"}),(0,r.kt)("h3",{id:"how-does-it-scale"},"How does it scale?"),(0,r.kt)("p",null,"In signalstory, think of a ",(0,r.kt)("inlineCode",{parentName:"p"},"store")," as a ",(0,r.kt)("inlineCode",{parentName:"p"},"signal-in-a-service"),". Start by establishing a store dedicated to a domain entity, a component, or both. Hence, state is distributed across multiple stores but can also be partially kept at the component level.",(0,r.kt)("br",{parentName:"p"}),"\n","And then:"),(0,r.kt)("ul",{style:{listStyleType:"none",paddingLeft:"mobile"===(0,i.i)()?"0em":"1em"}},(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\ude80 Use class methods to provide controlled access and mutations to shared state."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83c\udf0c If your store becomes too complex and bloated, slice it into multiple stores."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\u2728 Join and aggregate your state at the component level using signal mechanics."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83c\udf10 Need to sync states between stores synchronously? - Use events."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udd2e Need to decouple actors and consumers as you do in redux? - Use events."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udd04 Craving Immutability? - Just activate it."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83c\udfce\ufe0f Don't want full immutability because your store has to be super fast? - Don't activate it."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83e\uddd9\u200d\u2642\ufe0f Seeking a way to encapsulate side effects in a reusable, maintainable, and testable way? - Use effect objects."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udd0d Want a way to reuse and test queries spanning over multiple stores? - Use query objects."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udce6 Don't want to use a class for stores? - You don't have to."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udee0\ufe0f Tired of debugging state changes in the console? - Enable redux devtools."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83e\ude84 Still want some good old logging magic? - Enable Store logger plugin"),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\u23f3 Need to keep track of store history and selectively perform undo/redo operations? - Enable the history plugin."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udcbe Want to sync your state with local storage? - Enable the persistence plugin."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83d\udcc8 Need to get notified of whether your store is modified or currently loading? - Enable the Store Status plugin."),(0,r.kt)("li",{style:{marginBottom:"0.5em"}},"\ud83c\udfa8 Something's missing? - Write a custom plugin.")))}y.isMDXComponent=!0}}]);