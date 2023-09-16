# Validation Object

<blockquote>Validation library for JavaScript objects</blockquote>

<br />

<a href="https://www.npmjs.com/package/validation-object">
  <img src="https://img.shields.io/npm/v/validation-object.svg">
</a>
<a href="https://github.com/tatethurston/validation-object/blob/main/LICENSE">
  <img src="https://img.shields.io/npm/l/validation-object.svg">
</a>
<a href="https://bundlephobia.com/result?p=validation-object">
  <img src="https://img.shields.io/bundlephobia/minzip/validation-object">
</a>
<a href="https://www.npmjs.com/package/validation-object">
  <img src="https://img.shields.io/npm/dy/validation-object.svg">
</a>
<a href="https://github.com/tatethurston/validation-object/actions/workflows/ci.yml">
  <img src="https://github.com/tatethurston/validation-object/actions/workflows/ci.yml/badge.svg">
</a>
<a href="https://codecov.io/gh/tatethurston/validation-object">
  <img src="https://img.shields.io/codecov/c/github/tatethurston/validation-object/main.svg?style=flat-square">
</a>

## What is this? 🧐

A validation library for JavaScript objects.

## Examples 🚀

### Shorhand Variant

```ts
import { validationObject } from "validation-object";

interface User {
  name: string;
}

const User = validationObject<User>((obj) => {
  obj.validates("name", (attr) =>
    attr.length < 10 ? "must be longer than 10 characters" : undefined,
  );
});

const user = new User({ name: "foo" });
user.valid(); // false
user.errors.entries(); // { name: ["must be longer than 10 characters"] }

user.name = "0123456789";
user.valid(); // true
```

### Class Variant

```ts
import { ValidationObject } from "validation-object";

class User extends ValidationObject {
  name: string;

  constructor(attrs: { name: string }) {
    super();
    this.name = attrs.name;
  }

  validation() {
    this.validates("name", (attr) =>
      attr.length < 10 ? "must be longer than 10 characters" : undefined,
    );
  }
}

const user = new User({ name: "foo" });
user.valid(); // false
user.errors.entries(); // { name: ["must be longer than 10 characters"] }

user.name = "0123456789";
user.valid(); // true
```

## Installation & Usage 📦

1. Add this package to your project:
   - `npm install validation-object`

## Highlights

Coming Soon!

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/validation-object/blob/main/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/validation-object/blob/main/LICENSE).

```

```
