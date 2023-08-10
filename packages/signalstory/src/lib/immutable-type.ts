// Define a union type of built-in immutable primitives.
type ImmutablePrimitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null
  | Function
  | Date
  | RegExp;

/**
 * Recursively transforms a given type into its deep readonly equivalent.
 * This transformation makes sure that the resulting type and its nested properties are immutable.
 */
export type Immutable<T> = T extends ImmutablePrimitive
  ? T // If the type is an immutable primitive, return it as is.
  : T extends Map<infer Keys, infer Values>
  ? ReadonlyMap<Immutable<Keys>, Immutable<Values>>
  : T extends ReadonlyMap<infer Keys, infer Values>
  ? ReadonlyMap<Immutable<Keys>, Immutable<Values>>
  : T extends Set<infer Values>
  ? ReadonlySet<Immutable<Values>>
  : T extends ReadonlySet<infer Values>
  ? ReadonlySet<Immutable<Values>>
  : T extends Array<infer Values>
  ? ReadonlyArray<Immutable<Values>>
  : T extends ReadonlyArray<infer Values>
  ? ReadonlyArray<Immutable<Values>>
  : T extends {}
  ? { readonly [Key in keyof T]: Immutable<T[Key]> } // Recursively transform object properties.
  : Readonly<T>; // For other types, return them as Readonly to make them immutable.
