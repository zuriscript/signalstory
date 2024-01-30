"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[850],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=l(n),h=a,m=p["".concat(c,".").concat(h)]||p[h]||u[h]||o;return n?r.createElement(m,i(i({ref:t},d),{},{components:n})):r.createElement(m,i({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=h;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[p]="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},7918:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:8},i="Undo/Redo",s={unversionedId:"history",id:"history",title:"Undo/Redo",description:"The history tracking feature enables you to capture and manage state changes within your application, offering robust undo and redo functionalities that span an arbitrary number of stores. By utilizing transactions, you can group a series of related actions, ensuring they are treated as a single, atomic unit during undo and redo operations.",source:"@site/docs/history.md",sourceDirName:".",slug:"/history",permalink:"/signalstory/docs/history",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/history.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"Local state",permalink:"/signalstory/docs/local-state"},next:{title:"State Snapshot",permalink:"/signalstory/docs/state-snapshot"}},c={},l=[{value:"Usage",id:"usage",level:2},{value:"Track in a Component",id:"track-in-a-component",level:3},{value:"Track throughout the Application",id:"track-throughout-the-application",level:3},{value:"Group actions (Transaction)",id:"group-actions-transaction",level:2},{value:"Checking Undo and Redo Availability",id:"checking-undo-and-redo-availability",level:2},{value:"Accessing State History",id:"accessing-state-history",level:2}],d={toc:l},p="wrapper";function u(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"undoredo"},"Undo/Redo"),(0,a.kt)("p",null,"The history tracking feature enables you to capture and manage state changes within your application, offering robust ",(0,a.kt)("inlineCode",{parentName:"p"},"undo")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"redo")," functionalities that span an arbitrary number of stores. By utilizing ",(0,a.kt)("inlineCode",{parentName:"p"},"transactions"),", you can group a series of related actions, ensuring they are treated as a single, atomic unit during undo and redo operations."),(0,a.kt)("p",null,"Tracking history is exclusively supported for ",(0,a.kt)("inlineCode",{parentName:"p"},"immutable stores"),"."),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"trackHistory")," accepts the maximum length of the history as a parameter, along with the stores you intend to track.\nBy defining the maxLength parameter, you gain control over the history size, effectively managing memory usage. As the limit is reached, older entries are automatically removed. Note that the pruning process occurs asynchronously and employs an efficient implementation, allowing the history size to temporarily exceed the specified maximum length before pruning."),(0,a.kt)("p",null,"You have to specify all the stores you wish to track during setup. This ensures that only the intended stores are affected by undo and redo operations."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { trackHistory } from 'signalstory';\n\n// Create a tracker for four different stores with a maximum length of 50\nconst tracker = trackHistory(50, store1, store2, store3, store4);\n\n// Utilize undo and redo methods to navigate through the history of state changes\ntracker.undo();\ntracker.redo();\n\n// Stop tracking and clean up resources when history is no longer needed\ntracker.destroy();\n")),(0,a.kt)("h3",{id:"track-in-a-component"},"Track in a Component"),(0,a.kt)("p",null,"It's recommended to associate the tracker with a specific (root) feature component to ensure a well-defined start and stop of tracking.\nThis practice prevents the possibility of unlimited undo actions leading back to an invalid state. Furthermore, the tracker can be destroyed when the associated component is removed, ensuring efficient cleanup."),(0,a.kt)("p",null,"Consider the following example of integrating the tracker within a component:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},'@Component({\n  selector: \'app-root-feature\',\n  template: `\n    <button [disabled]="!tracker.canUndo()" (click)="tracker.undo()">\n      Undo\n    </button>\n    <button [disabled]="!tracker.canRedo()" (click)="tracker.redo()">\n      Redo\n    </button>\n  `,\n  styles: [],\n})\nexport class MyFeatureComponent implements OnDestroy {\n  public readonly tracker: HistoryTracker;\n\n  constructor(store: BooksStore) {\n    this.tracker = trackHistory(100, store);\n  }\n\n  ngOnDestroy(): void {\n    this.tracker.destroy();\n  }\n}\n')),(0,a.kt)("h3",{id:"track-throughout-the-application"},"Track throughout the Application"),(0,a.kt)("p",null,"For scenarios where you need to track history across a more extended period or throughout different pages, employing a service is a practical approach. Here's how you can use a service for history tracking:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"@Injectable({\n  providedIn: 'root',\n})\nexport class HistoryTrackingService implements OnDestroy {\n  public readonly tracker: HistoryTracker;\n\n  constructor(store1: Store1, store2: Store2, store3: Store3) {\n    this.tracker = trackHistory(100, store1, store2, store3);\n  }\n\n  ngOnDestroy(): void {\n    this.tracker.destroy();\n  }\n}\n")),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"While it is totally valid to create multiple trackers throughout the application, it's advisable to ensure that if two trackers are active simultaneously, they should target different stores. This precaution is necessary because undo and redo operations are not synchronized between trackers, which could potentially lead to unexpected behaviors.")),(0,a.kt)("h2",{id:"group-actions-transaction"},"Group actions (Transaction)"),(0,a.kt)("p",null,"You can use the ",(0,a.kt)("inlineCode",{parentName:"p"},"beginTransaction")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"endTransaction")," methods to group related changes into transactions. Optionally, you can pass a tag for improved readability in serialization, as reflected in tools like redux devtools."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"tracker.beginTransaction('Transaction Label');\nstore1.set({ value: 42 }, 'ChangeCommand');\nstore2.set({ value: 23 }, 'AnotherCommand');\ntracker.endTransaction();\n\n// Undo both commands on store1 and store2 at once\ntracker.undo();\n\n// Redo the whole transaction\ntracker.redo();\n")),(0,a.kt)("p",null,"If you undo during a transaction, the transaction is aborted and the states reverted back to the states before the transaction began."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"store1.set({ value: 10 }, 'Initial');\ntracker.beginTransaction('Transaction Label');\nstore1.set({ value: 20 }, 'ChangeCommand');\nstore1.set({ value: 30 }, 'ChangeAgain');\n\n// Undoing before ending the transaction\ntracker.und();\n\n// The transaction is aborted and discarded from history\n// store1 is reverted back to { value: 10 }\n")),(0,a.kt)("h2",{id:"checking-undo-and-redo-availability"},"Checking Undo and Redo Availability"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"tracker")," instance provides two signals, ",(0,a.kt)("inlineCode",{parentName:"p"},"canUndo")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"canRedo"),". You can use these signals to stay actively informed on whether undo or redo actions are possible."),(0,a.kt)("p",null,"Example usage in a template:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},'<button [disabled]="!tracker.canUndo()">Undo</button>\n<button [disabled]="!tracker.canRedo()">Redo</button>\n')),(0,a.kt)("h2",{id:"accessing-state-history"},"Accessing State History"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"tracker.getHistory();\n")),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"getHistory")," method returns an array, where each item represents a specific state change in the history of specified stores."))}u.isMDXComponent=!0}}]);