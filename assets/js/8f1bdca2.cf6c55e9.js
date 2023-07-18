"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[896],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),m=r,h=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return n?a.createElement(h,i(i({ref:t},p),{},{components:n})):a.createElement(h,i({ref:t},p))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2758:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const o={sidebar_position:1},i="Prolog",s={unversionedId:"prolog",id:"prolog",title:"Prolog",description:"In the ever-evolving landscape of state management, developers have been confronted with the challenge of effectively managing state. Over time, various techniques based on local state, singletons, and services have been explored to tackle this challenge. However, as applications grow in complexity, these approaches have revealed limitations in terms of scalability, testability, and code organization.",source:"@site/docs/prolog.md",sourceDirName:".",slug:"/prolog",permalink:"/signalstory/docs/prolog",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/prolog.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Installation",permalink:"/signalstory/docs/installation"}},l={},c=[],p={toc:c},u="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"prolog"},"Prolog"),(0,r.kt)("p",null,"In the ever-evolving landscape of state management, developers have been confronted with the challenge of effectively managing state. Over time, various techniques based on local state, singletons, and services have been explored to tackle this challenge. However, as applications grow in complexity, these approaches have revealed limitations in terms of scalability, testability, and code organization."),(0,r.kt)("p",null,"To address these challenges, a myriad of options have emerged. Established libraries like ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/DanWahlin/Observable-Store"},"observable-store"),", ",(0,r.kt)("a",{parentName:"p",href:"https://www.ngxs.io/"},"ngxs"),", ",(0,r.kt)("a",{parentName:"p",href:"https://ngrx.io/"},"ngrx")," and ",(0,r.kt)("a",{parentName:"p",href:"https://opensource.salesforce.com/akita/"},"akita")," have provided developers with battle-tested solutions and innovative concepts."),(0,r.kt)("p",null,"Meet ",(0,r.kt)("inlineCode",{parentName:"p"},"signalstory"),", a new protagonist entering the realm of state management. In this dynamic environment filled with numerous options, you may wonder why you should consider exploring this library. Here's why:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"signalstory harnesses the power of ",(0,r.kt)("a",{parentName:"li",href:"https://angular.io/guide/signals"},"Angular Signals"),", offering signals as native unit for state. It is one of the first libraries to embrace this brand new Angular feature, which is said to take over the world by storm."),(0,r.kt)("li",{parentName:"ul"},"Similar to other libraries, signalstory adopts a multi-store approach, empowering you to divide and conquer the state domain within your Angular application. Addtionally, it provides means to combine all those scattered store instances using joint queries and effects in a reusable and testable fashion"),(0,r.kt)("li",{parentName:"ul"},"No two projects are the same; hence signalstory aims to put as few restrictions as possible, while providing you a toolbox of utilities and ideas to unleash your creativity. Build the state management assisted solution that perfectly aligns with your unique needs."),(0,r.kt)("li",{parentName:"ul"},"You can opt for a fully imperative setup, where you're in control of every twist and turn in your state management journey. Just straightforward, imperative code that gets the job done."),(0,r.kt)("li",{parentName:"ul"},"When the need arises, you can seamlessly apply decoupling features, allowing your application to communicate through events and enabling loose coupling between different parts of your state management ecosystem.")),(0,r.kt)("p",null,"Embrace the next chapter of your state management adventure with ",(0,r.kt)("inlineCode",{parentName:"p"},"signalstory"),"."))}d.isMDXComponent=!0}}]);