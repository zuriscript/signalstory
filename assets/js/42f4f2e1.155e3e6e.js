"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[593],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=u(n),d=r,h=c["".concat(l,".").concat(d)]||c[d]||m[d]||i;return n?a.createElement(h,o(o({ref:t},p),{},{components:n})):a.createElement(h,o({ref:t},p))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:r,o[1]=s;for(var u=2;u<i;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8722:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>u});var a=n(7462),r=(n(7294),n(3905));const i={sidebar_position:5},o="Immutable Store",s={unversionedId:"immutable-store",id:"immutable-store",title:"Immutable Store",description:"Immutability has gained significant attention for its capacity to streamline state management, heighten predictability, and refine debugging processes. Particularly noteworthy is its conventional integration with the OnPush change detection strategy where immutable input objects have proved to accelerate performance in complex angular applications. Furthermore, immutability is a core principle in redux and the defining fundament of unidirectional data flow.",source:"@site/docs/immutable-store.md",sourceDirName:".",slug:"/immutable-store",permalink:"/signalstory/docs/immutable-store",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/immutable-store.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Configuration",permalink:"/signalstory/docs/configuration"},next:{title:"Building Blocks",permalink:"/signalstory/docs/category/building-blocks"}},l={},u=[{value:"The store",id:"the-store",level:2},{value:"Immutable type",id:"immutable-type",level:2},{value:"Immer.js",id:"immerjs",level:2},{value:"Structura.js",id:"structurajs",level:2}],p={toc:u},c="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"immutable-store"},"Immutable Store"),(0,r.kt)("p",null,"Immutability has gained significant attention for its capacity to streamline state management, heighten predictability, and refine debugging processes. Particularly noteworthy is its conventional integration with the ",(0,r.kt)("a",{parentName:"p",href:"https://angular.io/guide/change-detection-skipping-subtrees"},"OnPush change detection strategy")," where immutable input objects have proved to accelerate performance in complex angular applications. Furthermore, immutability is a core principle in redux and the defining fundament of unidirectional data flow."),(0,r.kt)("p",null,"At the moment, there is no real immutability support for signals out-of-the-box, eventhough there had been ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/angular/angular/pull/49644"},"experiments")," in the past. This is unsurprising, given the broad spectrum of applications that signals are intended for:"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},'We specifically didn\u2019t want to "pick sides" in the mutable / immutable\ndata discussion and designed the signal library (and other Angular APIs)\nso it works with both.\n',"\u2014"," ",(0,r.kt)("cite",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/angular/angular/discussions/49683"},"Angular Discussions - Sub-RFC 2: Signal APIs")))),(0,r.kt)("p",null,"However, this can potentially result in unexpected behaviors and challenging-to-debug errors. For instance:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"const sig = signal({ property: 'initial' }).asReadonly();\nsig().property = 'new';\nconsole.log(sig()); // prints \"{ property: 'new' }\"\n")),(0,r.kt)("p",null,"Hence, we can update the signal from everywhere without using ",(0,r.kt)("inlineCode",{parentName:"p"},"set"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"update"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"mutate")," and even without holding the reference to the actual ",(0,r.kt)("inlineCode",{parentName:"p"},"WritableSignal"),"."),(0,r.kt)("p",null,"Some other reasons for using ",(0,r.kt)("inlineCode",{parentName:"p"},"ImmutableStore")," over ",(0,r.kt)("inlineCode",{parentName:"p"},"Store"),":"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Improved interoperability with rxjs observables, which may relay on a stream of immutable values (see ",(0,r.kt)("inlineCode",{parentName:"li"},"buffer"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"shareReplay"),", etc.)"),(0,r.kt)("li",{parentName:"ul"},"Allows for accumulation of singal emmited values over time"),(0,r.kt)("li",{parentName:"ul"},"Helps following unidirectional dataflow principle"),(0,r.kt)("li",{parentName:"ul"},"More closely adheres to the principles of the functional programming paradigm, enhancing predictability in state modification (matter of taste)"),(0,r.kt)("li",{parentName:"ul"},"Improved signal state change detection, since modification of a signal only then fires a changed event notification if the new value is an actual new object")),(0,r.kt)("h2",{id:"the-store"},"The store"),(0,r.kt)("p",null,"An immutable store works same as a regular store, but uses a different base class:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// highlight-start\nclass MyImmutableStore extends ImmutableStore<MyState> {\n// highlight-end\n  constructor() {\n    super({\n        initialState: { ... },\n        name: 'My Store',\n        enableLogging: true,\n        plugins: [\n          useDevtools(),\n          useStoreHistory(),\n          useStorePersistence(),\n          useDeepFreeze(),\n        ],\n    });\n  }\n}\n\n")),(0,r.kt)("p",null,"You can also use it as dynamic store without declaring a class first:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"const counterStore = new ImmutableStore<{ val: number }>({\n  initialState: { val: 5 },\n});\ncounterStore.mutate(state => state.val++, 'Increment');\nconsole.log(counterStore.state()); // prints \"{ val: 6 }\"\n")),(0,r.kt)("h2",{id:"immutable-type"},"Immutable type"),(0,r.kt)("p",null,"The Immutable store wraps the state object inside a generic ",(0,r.kt)("inlineCode",{parentName:"p"},"Immutable<T>")," type which provides compile time deep immutability for any object type."),(0,r.kt)("p",null,"Be aware, that typeScript's type system doesn't always prevent violations of ",(0,r.kt)("inlineCode",{parentName:"p"},"readonly"),", and therefore ",(0,r.kt)("inlineCode",{parentName:"p"},"Immutable<T>")," constraints. Scenarios like type assertions, structural typing compatibility, and passing readonly objects to functions that expect mutable ones, can all bypass these immutability checks. For a stronger guarantee of immutability, consider utilizing the ",(0,r.kt)("a",{parentName:"p",href:"/signalstory/docs/plugins/deep-freeze"},"deep freeze store plugin"),"."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"The default implementation for producing immutable state is a basic Clone-and-Mutate approach, leveraging ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/structuredClone"},"structuredClone")," - or JSON Stringify/Parse as alternative, if structuredClone is unsupported. While this method might be acceptable for various scenarios, the user is expected to pass a more sophisticated implementation from libraries like ",(0,r.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/"},"immer.js")," or ",(0,r.kt)("a",{parentName:"p",href:"https://giusepperaso.github.io/structura.js/"},"structura.js")," for more robustness and speed.")),(0,r.kt)("h2",{id:"immerjs"},"Immer.js"),(0,r.kt)("p",null,"Basic example using ",(0,r.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/"},"immer.js"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// highlight-start\nimport { produce } from 'immer';\n// highlight-end\n\nclass MyImmerStore extends ImmutableStore<MyState> {\n  constructor() {\n    super({\n        initialState: { ... },\n        name: 'My Immmer Store',\n        // highlight-start\n        mutationProducerFn: produce,\n        // highlight-end\n    });\n  }\n}\n")),(0,r.kt)("h2",{id:"structurajs"},"Structura.js"),(0,r.kt)("p",null,"At the moment, the ",(0,r.kt)("a",{parentName:"p",href:"https://giusepperaso.github.io/structura.js/"},"structura.js")," ",(0,r.kt)("inlineCode",{parentName:"p"},"produce")," type does not match directly with the expected function type: ",(0,r.kt)("inlineCode",{parentName:"p"},"(currentState: TState, mutation: (draftState: TState) => void) => TState"),". A possible workaround, among other strategies, involves utilizing double assertions:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// highlight-start\nimport { produce } from \"structurajs\"\n// highlight-end\n\ntype MutationFn<T> = (currentState: T, mutation: (draftState: T) => void) => T;\n\nclass MyStructuraStore extends ImmutableStore<MyState> {\n  constructor() {\n    super({\n        initialState: { ... },\n        name: 'My Structura Store',\n        // highlight-start\n        mutationProducerFn: produce as unknown as MutationFn<MyState>,\n        // highlight-end\n    });\n  }\n}\n")))}m.isMDXComponent=!0}}]);