# instanceof-unifier

[![Travis CI][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Allow `instanceof` to match even if comparing an instance created by a different
copy of the class.  This module requires node.js 6.5.0 or above to function, an
exception will be thrown if you attempt to load this module in older versions.

## instanceofUnifier(Class, matcher)

Calling this function makes alterations to the way `instanceof` works on `Class`.
`matcher` must be a `string` or a `Symbol`.  If a string is provided it will be
passed to `Symbol.for` to create a matcher symbol.

The user is responsible for picking a unique symbol name.  It is recommended to use
`<module-name>@<version>:package-local-id`.  Version does not have to match the package
version but it is important to increment it any time a version update is not compatible
with previous versions.


## Example Usage

Create an ESM module:
```js
// index.mjs
import instanceofUnifier from 'instanceof-unifier';

export class MyClass {
}

instanceofUnifier(MyClass, 'my-package-name@1.0.0:MyClass');
```

Transpile to Commonjs (babel output shown):
```js
// index.cjs
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyClass = void 0;

var _instanceofUnifier = _interopRequireDefault(require("instanceof-unifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MyClass {}

exports.MyClass = MyClass;
(0, _instanceofUnifier.default)(MyClass, 'my-package-name@1.0.0:MyClass');
```

This avoids the divergent specifier hazard for `instanceof`.  You can test:
```js
import indexCJS from './index.cjs';
import {MyClass as ESM} from './index.mjs';

const CJS = indexCJS.MyClass;

const cjs = new CJS();
const esm = new ESM();

if (cjs instanceof CJS && cjs instanceof ESM) {
	console.log('cjs is instanceof both classes');
}

if (esm instanceof CJS && esm instanceof ESM) {
	console.log('esm is instanceof both classes');
}
```

In addition to the divergent specifier hazard this also ensures `instanceof` matches
between multiple copies of your module.


[npm-image]: https://img.shields.io/npm/v/instanceof-unifier.svg
[npm-url]: https://npmjs.org/package/instanceof-unifier
[travis-image]: https://travis-ci.org/cfware/instanceof-unifier.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/instanceof-unifier
[downloads-image]: https://img.shields.io/npm/dm/instanceof-unifier.svg
[downloads-url]: https://npmjs.org/package/instanceof-unifier
[license-image]: https://img.shields.io/npm/l/instanceof-unifier.svg
