"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[195],{3261:(e,t,A)=>{A.r(t),A.d(t,{default:()=>u});var n=A(7294),a=A(6010),s=A(9960),r=A(2263),o=A(7686),c=A(7462);const g={features:"features_t9lD",featureSvg:"featureSvg_GfXr"},i=[{title:"Signal-Based State Management",Svg:A(1067).Z,description:n.createElement(n.Fragment,null,"Utilizes a signal-based approach to state management. This eliminates the need for asynchronous observables in components and templates (except for side effects), making the state management process more streamlined.")},{title:"Event Driven",Svg:A(2926).Z,description:n.createElement(n.Fragment,null,"Supports event handling, enabling communication and interaction between different stores. Events can be used for inter-store communication or for triggering side effects.")},{title:"Open Architecture",Svg:A(7007).Z,description:n.createElement(n.Fragment,null,"Offers an open architecture, allowing you to choose between different styles of store implementations. You can use plain repository-based stores or even mimicking Redux-like behavior depending on your needs and preferences.")},{title:"Flexible Side Effect Execution",Svg:A(9503).Z,description:n.createElement(n.Fragment,null,"Side effects can be implemented in different ways in signalstory. You have the option to include side effects directly as part of the store, use service-based side effects, or execute effects imperatively on the store based on your specific requirements.")},{title:"Automatic Persistence to Local Storage",Svg:A(6171).Z,description:n.createElement(n.Fragment,null,"Provides automatic persistence of store state to local storage. Any changes made to the store are automatically synchronized with local storage, ensuring that the state is preserved across page reloads.")},{title:"State History",Svg:A(1348).Z,description:n.createElement(n.Fragment,null,"You can enable store history to track state changes over time and perform undo and redo operations.")}];function l(e){let{Svg:t,title:A,description:s}=e;return n.createElement("div",{className:(0,a.Z)("col col--4")},n.createElement("div",{className:"text--center"},n.createElement("img",{className:g.featureSvg,src:t})),n.createElement("div",{className:"color-black text--center padding-horiz--md"},n.createElement("h3",null,A),n.createElement("p",null,s)))}function f(){return n.createElement("section",{className:(0,a.Z)("background-yellow",g.feautures)},n.createElement("div",{className:"container"},n.createElement("div",{className:"row"},i.map(((e,t)=>n.createElement(l,(0,c.Z)({key:t},e)))))))}var d=A(4996);const m={heroBanner:"heroBanner_qdFl",buttons:"buttons_AeoN"};function B(){return n.createElement("header",{className:(0,a.Z)("hero hero--primary",m.heroBanner)},n.createElement("div",{className:"hero-caption"},n.createElement("img",{id:"hero-mobile-logo",src:(0,d.Z)("/img/signalstory_no_background.png")}),n.createElement("h1",{className:"hero__title"},n.createElement("span",{className:"fluid"},"signalstory")," | Empower Your Angular State Management"),n.createElement("p",{className:"hero__subtitle"},"Enter the Realm of stored Signals, Embark on a Data-driven Adventure with signalstory, Your Lightweight Backpack"),n.createElement("div",{className:m.buttons},n.createElement(s.Z,{id:"docs-button",className:"button button--secondary button--lg",to:"/docs/prolog"},"Every odyssey starts at the docs \ud83e\udded"))))}function u(){const{siteConfig:e}=(0,r.Z)();return n.createElement(o.Z,{title:e.title,description:"Description will go into a meta tag in <head />"},n.createElement(B,null),n.createElement("main",null,n.createElement(f,null)))}},7007:(e,t,A)=>{A.d(t,{Z:()=>n});const n=A.p+"assets/images/castle-a4b3b7fede392b0f24804f9fbc20f780.png"},9503:(e,t,A)=>{A.d(t,{Z:()=>n});const n="data:image/png;base64,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"},1067:(e,t,A)=>{A.d(t,{Z:()=>n});const n=A.p+"assets/images/magic-eca90c1b5e01b10e7281b6f8672f6b90.png"},2926:(e,t,A)=>{A.d(t,{Z:()=>n});const n=A.p+"assets/images/pumpkin-carriage-743778411e083da56aa1646081bf81aa.png"},6171:(e,t,A)=>{A.d(t,{Z:()=>n});const n=A.p+"assets/images/scroll-8dd8a26b8dc6c1868a08ca782eb0be8e.png"},1348:(e,t,A)=>{A.d(t,{Z:()=>n});const n=A.p+"assets/images/spellbook-c242e47549edb91d0075b1f4a67ba5aa.png"}}]);