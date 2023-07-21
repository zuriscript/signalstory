"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[464],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var r=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,a=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=l(n),f=s,h=d["".concat(c,".").concat(f)]||d[f]||u[f]||a;return n?r.createElement(h,o(o({ref:t},p),{},{components:n})):r.createElement(h,o({ref:t},p))}));function h(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var a=n.length,o=new Array(a);o[0]=f;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[d]="string"==typeof e?e:s,o[1]=i;for(var l=2;l<a;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},8143:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var r=n(7462),s=(n(7294),n(3905));const a={sidebar_position:3},o="Effect",i={unversionedId:"building-blocks/effect",id:"building-blocks/effect",title:"Effect",description:"Effects are basically side effects involving other entities and systems outside the regular flow that may affect the store. They are typically used for handling asynchronous operations, like making HTTP calls, that have an impact on the store's state.",source:"@site/docs/building-blocks/effect.md",sourceDirName:"building-blocks",slug:"/building-blocks/effect",permalink:"/signalstory/docs/building-blocks/effect",draft:!1,editUrl:"https://github.com/zuriscript/signalstory/tree/master/docs/docs/building-blocks/effect.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Command",permalink:"/signalstory/docs/building-blocks/command"},next:{title:"Event",permalink:"/signalstory/docs/building-blocks/event"}},c={},l=[{value:"Store Class Methods (Discouraged)",id:"store-class-methods-discouraged",level:2},{value:"Separate Service",id:"separate-service",level:2},{value:"Effect Objects",id:"effect-objects",level:2},{value:"Store coupled effect object",id:"store-coupled-effect-object",level:3},{value:"Decoupled effect object",id:"decoupled-effect-object",level:3}],p={toc:l},d="wrapper";function u(e){let{components:t,...n}=e;return(0,s.kt)(d,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"effect"},"Effect"),(0,s.kt)("p",null,"Effects are basically side effects involving other entities and systems outside the regular flow that may affect the store. They are typically used for handling asynchronous operations, like making HTTP calls, that have an impact on the store's state."),(0,s.kt)("p",null,"There are multiple ways to implement effects in ",(0,s.kt)("inlineCode",{parentName:"p"},"signalstory"),":"),(0,s.kt)("h2",{id:"store-class-methods-discouraged"},"Store Class Methods (Discouraged)"),(0,s.kt)("p",null,"Effects can be implemented as class methods within the store itself and by injecting needed services into the store directly."),(0,s.kt)("admonition",{type:"caution"},(0,s.kt)("p",{parentName:"admonition"},"While this approach is possible, it is generally discouraged as it can lead to increased coupling between the store and the side effect logic. It can make the store class bloated and harder to test and maintain.")),(0,s.kt)("p",null,"Example usage:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-typescript"},"class UserStore extends Store<UserState> {\n  constructor(private userService: UserService) {\n    super({ initialState: { users: [] } });\n  }\n\n  // Discouraged approach: Effect implemented as a store method\n  // We could also update the state using 'tap' and subscribe at the client\n  fetchUsers() {\n    this.userService.getUsers().subscribe(\n      users => {\n        this.set({ users }, 'Fetch Users');\n      },\n      error => {\n        // Handle error\n      }\n    );\n  }\n}\n")),(0,s.kt)("h2",{id:"separate-service"},"Separate Service"),(0,s.kt)("p",null,"A more recommended approach is to use a separate service to encapsulate the effect logic. This promotes better separation of concerns and reduces coupling between the store and the side effect code. The service can communicate with the store through store methods or events. A component would then use the service to perform side effects (like loading the state from backend) and the store for reading and in memory modifications."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-typescript"},"@Injectable()\nclass UserEffectService {\n  constructor(private userService: UserService, private userStore: UserStore) {}\n\n  // We could also update the state using 'tap' and subscribe at the client\n  fetchUsers() {\n    this.userService.getUsers().subscribe(\n      users => {\n        // Prefer dedicated class method commands instead\n        this.userStore.set({ users }, 'Fetch Users');\n      },\n      error => {\n        // Handle error\n      }\n    );\n  }\n}\n")),(0,s.kt)("h2",{id:"effect-objects"},"Effect Objects"),(0,s.kt)("p",null,"signalstory provides a ",(0,s.kt)("inlineCode",{parentName:"p"},"createEffect")," function that allows you to create standalone effect objects. This approach promotes even better separation of concerns and modularity. Effect objects can be defined separately from the store and can be used by multiple stores or services. Also testing is simpler and cleaner, since we're handling a standalone and fully encapsulated object with only one single purpose."),(0,s.kt)("p",null,"Effects run in an injection context, hence, we can use ",(0,s.kt)("inlineCode",{parentName:"p"},"inject")," inisde the function implementation to make use of registered services like ",(0,s.kt)("inlineCode",{parentName:"p"},"HttpClient"),". If you don't need an injection context for a command, you can set the optional parameter ",(0,s.kt)("inlineCode",{parentName:"p"},"withInjectionContext")," to false."),(0,s.kt)("p",null,"Effects can take parameter, are invoked imperatively can return any type (does not have to be an ",(0,s.kt)("inlineCode",{parentName:"p"},"observable"),"). An effect object either targets a specific store (",(0,s.kt)("inlineCode",{parentName:"p"},"store coupled effect"),") or can be used more generally (",(0,s.kt)("inlineCode",{parentName:"p"},"decoupled effect"),")."),(0,s.kt)("h3",{id:"store-coupled-effect-object"},"Store coupled effect object"),(0,s.kt)("p",null,"Store coupled effects provide a way to directly modify a specific store within an effect. Unlike decoupled effects that use events to communicate state changes, store coupled effects directly interact with the store's methods and state. This approach is useful when a specific store needs to be modified within an effect, and the coupling between the effect and the store is acceptable within the application's architecture."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-typescript"},"export const fetchUsers = createEffect(\n  'Fetch Users from User Service',\n  (store: UserStore, searchArgument: string) => {\n    const service = inject(UserService);\n    return service.fetchUsers(searchArgument).pipe(\n      tap(users => {\n        store.setUsers(users);\n      })\n    );\n  }\n);\n\n// Any Component or service:\n\n@Component({\n  selector: 'app-root',\n  template: '',\n  styles: [],\n})\nexport class AppComponent {\n  constructor(private readonly userStore: UserStore) {}\n\n  onSearchArgumentChanged(argument: string) {\n    // highlight-start\n    this.userStore.runEffect(fetchUsers, argument).subscribe();\n    // highlight-end\n  }\n}\n")),(0,s.kt)("p",null,"Using ",(0,s.kt)("inlineCode",{parentName:"p"},"Covariance"),", we can aim for a higher degree of flexibility and reusability by working with stores that share a common structure.\nCovariance is a type system property that enables a more generic type to be used in place of a more specific type. In the context of store coupled effects, it means that an effect can accept a store whose state type is compatible with a more specific state type. This allows the effect to work with multiple stores that have similar structures, increasing code reuse."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-typescript"},"interface User {\n  id: string;\n  name: string;\n}\n\ninterface Organization {\n  users: User[];\n  name: string;\n  admin?: User;\n}\n\n@Injectable({ providedIn: 'root' })\nexport class OrganizationStore extends Store<Organization> {\n  constructor() {\n    super({\n      initialState: {\n        users: [{ id: '1234', name: 'Martin Hex' }],\n        name: 'Org',\n      },\n    });\n  }\n}\n\n// Here we are using an effect targeting a less specific type than Organization\n// Note: Effects do not have to be async\nexport const resetUser = createEffect(\n  'Reset Users Effect',\n  // highlight-start\n  (store: Store<{ users: User[] }>) =>\n    // highlight-end\n    store.mutate(state => (state.users = []), 'Reset Users')\n);\n\n// Any Component or service:\n\n@Component({\n  selector: 'app-root',\n  template: '',\n  styles: [],\n})\nexport class AppComponent {\n  constructor(private readonly orgStore: OrganizationStore) {}\n\n  onResetClick() {\n    // highlight-start\n    this.orgStore.runEffect(resetUser).subscribe();\n    // highlight-end\n  }\n}\n")),(0,s.kt)("h3",{id:"decoupled-effect-object"},"Decoupled effect object"),(0,s.kt)("p",null,"Decoupled effects allow for a flexible and decoupled approach to handle side effects. They promote code modularity, separation of concerns, testability, and overall flexibility when dealing with asynchronous tasks and side effects. These effect objects are also created using the ",(0,s.kt)("inlineCode",{parentName:"p"},"createEffect")," function but have a parameter of type ",(0,s.kt)("inlineCode",{parentName:"p"},"Store<any>"),", instead of a specific store. Decoupled effects indirectly affect the store by using ",(0,s.kt)("inlineCode",{parentName:"p"},"events")," to communicate state changes. Stores, which need to react to those events, may register an eventhandler. Read more in ",(0,s.kt)("a",{parentName:"p",href:"/signalstory/docs/building-blocks/event"},"Events"),"."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-typescript"},"import { HttpClient } from '@angular/common/http';\nimport { Store, createEffect, createEvent } from 'signalstory';\n\n// Create events\nexport const userLoadedSuccess = createEvent<User>('User loaded successfully');\nexport const userLoadedFailure = createEvent('Failed to load user');\n\n// Create decoupled effect\nexport const fetchUser = createEffect(\n  'Fetch User',\n  (store: Store<any>, userId: number) => {\n    return inject(HttpClient)\n      .get<User>(`/api/users/${userId}`)\n      .pipe(\n        tap(user => {\n          // highlight-start\n          store.publish(userLoadedSuccess, user);\n          // highlight-end\n        }),\n        catchError(error => {\n          // highlight-start\n          store.publish(userLoadedFailure, error);\n          // highlight-end\n          return of(error);\n        })\n      );\n  }\n);\n")))}u.isMDXComponent=!0}}]);