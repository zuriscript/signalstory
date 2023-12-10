"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[243],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>v});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(n),h=r,v=p["".concat(l,".").concat(h)]||p[h]||u[h]||o;return n?a.createElement(v,i(i({ref:t},d),{},{components:n})):a.createElement(v,i({ref:t},d))}));function v(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3334:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const o={sidebar_position:4},i="Event",s={unversionedId:"building-blocks/event",id:"building-blocks/event",title:"Event",description:"By utilizing events and event handlers, you can establish communication between stores, propagate side effect results, and coordinate actions across different parts of your application. This decoupled approach enables a more modular and flexible architecture, allowing for better maintainability and extensibility of your Angular application.",source:"@site/docs/building-blocks/event.md",sourceDirName:"building-blocks",slug:"/building-blocks/event",permalink:"/signalstory/docs/building-blocks/event",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/building-blocks/event.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Effect",permalink:"/signalstory/docs/building-blocks/effect"},next:{title:"Local state",permalink:"/signalstory/docs/local-state"}},l={},c=[{value:"Wyh should I use Events?",id:"wyh-should-i-use-events",level:2},{value:"Event Blueprint",id:"event-blueprint",level:2},{value:"Event Handlers",id:"event-handlers",level:2},{value:"Publishing Events",id:"publishing-events",level:2}],d={toc:c},p="wrapper";function u(e){let{components:t,...n}=e;return(0,r.kt)(p,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"event"},"Event"),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"By utilizing events and event handlers, you can establish communication between stores, propagate side effect results, and coordinate actions across different parts of your application. This decoupled approach enables a more modular and flexible architecture, allowing for better maintainability and extensibility of your Angular application.")),(0,r.kt)("h2",{id:"wyh-should-i-use-events"},"Wyh should I use Events?"),(0,r.kt)("p",null,"Events can be used for untangling and breaking down dependencies among stores, commands, and actions. They also provide means for propagating state across stores. For instance, if you want ",(0,r.kt)("inlineCode",{parentName:"p"},"store2")," to immediately react when the state of ",(0,r.kt)("inlineCode",{parentName:"p"},"store1")," changes without directly invoking ",(0,r.kt)("inlineCode",{parentName:"p"},"store2"),", events offer an elegant solution. Unlike signal effects, where modifying signals within the effect's scope is forbidden by default, signalstory events and handlers operate synchronously. This helps mitigate potential issues stemming from asynchronous dispatches, such as errors or unnecessary change detection cycles."),(0,r.kt)("p",null,"Instead of the imperative sequence:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"store1.updateSomething();\nstore2.doSomething();\nstore3.updateBecauseTheOtherStoresDid();\n")),(0,r.kt)("p",null,"Adopt a more streamlined approach:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"publishStoreEvent(somethingHappenedEventAndIWantMyStoresToReact);\n// All relevant stores (store1, store2, store3) react immediately and synchronously\n// -> As if they were called imperatively after each other\n")),(0,r.kt)("p",null,"Considerations:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"You can still handle effects asynchronously by leveraging mechanisms like ",(0,r.kt)("inlineCode",{parentName:"li"},"setTimeout")," inside the handler to offload execution to the macrotask queue."),(0,r.kt)("li",{parentName:"ul"},"Eventhandler registration does not prohibit circular dependencies, so you have to make sure yourself, that there are no infinite circular updates")),(0,r.kt)("h2",{id:"event-blueprint"},"Event Blueprint"),(0,r.kt)("p",null,"An ",(0,r.kt)("inlineCode",{parentName:"p"},"event")," is represented by the ",(0,r.kt)("inlineCode",{parentName:"p"},"StoreEvent")," interface, which typically includes a name and an optional payload. The name serves as a unique identifier for the event, while the payload contains any additional data associated with the event. You can use the ",(0,r.kt)("inlineCode",{parentName:"p"},"createEvent")," function provided by signalstory to create ",(0,r.kt)("inlineCode",{parentName:"p"},"event blueprints")," with a name and payload type. Those blueprint can then be published alongside a payload parameter:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createEvent } from 'signalstory';\n\nconst myEventWithPayload = createEvent<MyPayloadType>('My Event');\nconst myEventWithNoPayload = createEvent('My Event and nothing more');\n")),(0,r.kt)("h2",{id:"event-handlers"},"Event Handlers"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Event handlers")," are functions that are executed when a specific event is published. They define the behavior or actions to be taken in response to the occurrence of an event. An event handler is always registered in the context of a specific store and hence defines how a certain store reacts to a specific event.\nTo register an event handler, you need to specify the event you want to handle and provide the corresponding handler function."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Event handlers are invoked ",(0,r.kt)("strong",{parentName:"p"},"synchronously")," and are intended for specific use cases. Events should capture meaningful incidents that happened (e.g. http calls, user interaction, cross cutting state changes) and that stores need to respond to effectively. Keep in mind that infinite circular updates can occur if further events are pubblished within a handler which transitively invokes the same handler again.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { Store } from 'signalstory';\n\nexport const booksLoadedFailure = createEvent('Books could not be loaded');\n\n@Injectable({ providedIn: 'root' })\nexport class BooksStore extends Store<Book[]> {\n  constructor() {\n    super({\n      initialState: [],\n      enableEvents: true,\n    });\n\n    this.registerHandler(\n      googleBooksLoadedFailure,\n      this.handleGoogleBooksLoadedFailureEvent\n    );\n  }\n\n  private handleGoogleBooksLoadedFailureEvent(\n    store: this,\n    _: StoreEvent<never>\n  ) {\n    store.setBooks([]);\n  }\n}\n")),(0,r.kt)("h2",{id:"publishing-events"},"Publishing Events"),(0,r.kt)("p",null,"Events can be published using the ",(0,r.kt)("inlineCode",{parentName:"p"},"publishStoreEvent")," method. Publishing an event triggers the execution of all registered event handlers synchronously for that particular event."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createEvent, publishStoreEvent } from 'signalstory';\n\nconst myEvent = createEvent<number>('My Event');\n\n// You can also publish events in a store command\n// Or as result of an effect\npublishStoreEvent(myEvent, 5);\n")))}u.isMDXComponent=!0}}]);