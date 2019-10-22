'use strict';

module.exports = instanceofUnifier;

/* istanbul ignore next */
if (!Symbol.hasInstance) {
	throw new Error('Not supported');
}

function instanceofUnifier(Class, matcher) {
	if (typeof Class !== 'function') {
		throw new TypeError('First argument must be a class');
	}

	if (typeof matcher !== 'string') {
		throw new TypeError('Second argument must be a unique string');
	}

	matcher = Symbol.for(matcher);
	Object.defineProperties(Class, {
		[matcher]: {
			get() {
				return true;
			}
		},

		[Symbol.hasInstance]: {
			value(instance) {
				if (this === Class) {
					return instance.constructor[matcher] === true;
				}

				return Object[Symbol.hasInstance].call(this, instance);
			}
		}
	});
}
