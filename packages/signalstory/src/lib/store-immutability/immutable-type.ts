/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Define a union type of built-in immutable primitives.
 */
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
 * Checks if a given type is a tuple.
 */
type IsTuple<Type> = Type extends readonly any[]
  ? any[] extends Type
    ? never
    : Type
  : never;

// Type wrappers for regular and readonly built-in container types
type AnyArray<T = any> = Array<T> | ReadonlyArray<T>;
type AnySet<T = any> = Set<T> | ReadonlySet<T>;
type AnyMap<TKey = any, TVal = any> = Map<TKey, TVal> | ReadonlyMap<TKey, TVal>;

/**
 * Recursively transforms a given type into its deep readonly equivalent.
 * This transformation makes sure that the resulting type and its nested properties are immutable.
 */
export type Immutable<T> = T extends ImmutablePrimitive
  ? T // If the type is an immutable primitive, return it as is.
  : T extends AnyMap<infer Keys, infer Values>
    ? ReadonlyMap<Immutable<Keys>, Immutable<Values>>
    : T extends AnySet<infer Values>
      ? ReadonlySet<Immutable<Values>>
      : T extends AnyArray<infer Values>
        ? T extends IsTuple<T>
          ? { readonly [Key in keyof T]: Immutable<T[Key]> }
          : ReadonlyArray<Immutable<Values>>
        : T extends object
          ? { readonly [Key in keyof T]: Immutable<T[Key]> } // Recursively transform object properties.
          : Readonly<T>; // For other types, return them as Readonly to make them immutable.
