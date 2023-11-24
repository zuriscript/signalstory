"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[896],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),m=a,h=p["".concat(l,".").concat(m)]||p[m]||d[m]||o;return n?r.createElement(h,i(i({ref:t},u),{},{components:n})):r.createElement(h,i({ref:t},u))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2758:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:1},i="Prolog",s={unversionedId:"prolog",id:"prolog",title:"Prolog",description:"Every frontend application has state. Therefore, state management is the process of organizing data, be it strictly UI-related or business/domain-related, and connecting it with the view. Apart from sharing state between components and services, there are many other different patterns and architectural styles. However, what matters most is choosing the right architecture for your requirements and being consistent with it. Architectures should bring readability and predictability to your code, making it easy to maintain and scale.",source:"@site/docs/prolog.md",sourceDirName:".",slug:"/prolog",permalink:"/signalstory/docs/prolog",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/prolog.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Installation",permalink:"/signalstory/docs/installation"}},l={},c=[{value:"Why a new state management library?",id:"why-a-new-state-management-library",level:3},{value:"How does it scale?",id:"how-does-it-scale",level:3}],u={toc:c},p="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"prolog"},"Prolog"),(0,a.kt)("p",null,"Every frontend application has state. Therefore, state management is the process of organizing data, be it strictly UI-related or business/domain-related, and connecting it with the view. Apart from sharing state between components and services, there are many other different patterns and architectural styles. However, what matters most is choosing the right architecture for your requirements and being consistent with it. Architectures should bring readability and predictability to your code, making it easy to maintain and scale."),(0,a.kt)("h3",{id:"why-a-new-state-management-library"},"Why a new state management library?"),(0,a.kt)("p",null,"State management is hard and the right approach is highly dependent on your project and your team. There's no one-size-fits-all solution, and that's why many established libraries exist."),(0,a.kt)("p",null,"What sets signalstory apart from many other solutions is its use of ",(0,a.kt)("a",{parentName:"p",href:"https://angular.io/guide/signals"},"Angular signals")," as native unit for state. Therefore, there is no intention for signalstory to be employed outside of the Angular framework. Signalstory adopts an object-oriented approach and is built around an imperative setup. However, when the need arises, it is possible to leverage decoupling features, enabling the application to communicate through events and therefore enabling loose coupling between different parts."),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Having used multiple libraries and architectures in the past, I envisioned signalstory to be very simple to use. It should provide an enjoyable user experience for developers, whether junior or senior, while incorporating all the features you need to master your frontend state requirements. At its core, signalstory imposes as few restrictions as possible, providing a toolbox of utilities and concepts to spark creativity.")),(0,a.kt)("h3",{id:"how-does-it-scale"},"How does it scale?"),(0,a.kt)("p",null,"In signalstory, think of a ",(0,a.kt)("inlineCode",{parentName:"p"},"store")," as a ",(0,a.kt)("inlineCode",{parentName:"p"},"signal-in-a-service"),". Start by establishing a store dedicated to a domain entity, a component, or both. Hence, state is distributed across multiple stores but can also be partially kept at the component level.",(0,a.kt)("br",{parentName:"p"}),"\n","And then:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Use class methods to provide controlled access and mutations to shared state."),(0,a.kt)("li",{parentName:"ul"},"If your store becomes unwieldy, slice it into multiple stores."),(0,a.kt)("li",{parentName:"ul"},"Join and aggregate your state at the component level using signal mechanics."),(0,a.kt)("li",{parentName:"ul"},"Need to sync states between stores? - Use events."),(0,a.kt)("li",{parentName:"ul"},"Need to decouple actors and consumers as you do in redux? - Use events."),(0,a.kt)("li",{parentName:"ul"},"Craving Immutability? - Just activate it."),(0,a.kt)("li",{parentName:"ul"},"Don't want full immutability because your store has to be super fast? - Don't activate it."),(0,a.kt)("li",{parentName:"ul"},"Seeking a way to encapsulate side effects in a reusable, maintainable, and testable way? - Use effect objects."),(0,a.kt)("li",{parentName:"ul"},"Want a way to reuse and test queries spanning over multiple stores? - Use query objects."),(0,a.kt)("li",{parentName:"ul"},"Tired of debugging state changes in the console? - Enable redux devtools."),(0,a.kt)("li",{parentName:"ul"},"Need to keep track of store history and selectively perform undo/redo operations? - Enable the history plugin."),(0,a.kt)("li",{parentName:"ul"},"Want to sync your state with local storage? - Enable the persistence plugin."),(0,a.kt)("li",{parentName:"ul"},"Something's missing? - Write a custom plugin."),(0,a.kt)("li",{parentName:"ul"},"Read the docs for more features and concepts")))}d.isMDXComponent=!0}}]);