# TypeScript Guidelines

## Overview

- Strict mode with additional strictness flags (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)

## Functions

- Use ES6 arrow functions over `function` declarations.
- Always use curly braces for function bodies. Avoid inline returns, `break` statements, and other single-line control flow shortcuts.
- Rely on TypeScript's type inference for return types. Only annotate a return type explicitly when it is needed to narrow a type or resolve a type error.

## Types

- Use `Array<T>` syntax for array types instead of `T[]`.

## Conditionals

- Prefer shorthand falsy checks (e.g. `!value.length`, `!items`) over explicit comparisons (`value.length === 0`, `items === null`).
- Exception: avoid shorthand falsy checks in JSX template expressions where short-circuit evaluation could unintentionally render a `0` or other falsy primitive (e.g. use `value.length > 0 && <Component />` instead of `value.length && <Component />`).
