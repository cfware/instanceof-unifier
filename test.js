'use strict';

const assert = require('assert');
const installUnifier = require('.');
const nodeMajor = process.versions.node.split('.')[0];

function typeErrorCheck(message) {
	if (nodeMajor < 8) {
		return TypeError;
	}

	return {
		name: 'TypeError',
		message
	}
}

assert.throws(
	() => installUnifier('not a class', 'symbol'),
	typeErrorCheck('First argument must be a class')
);

assert.throws(
	() => installUnifier(class {}, []),
	typeErrorCheck('Second argument must be a unique string')
);

class Pkg1 {}
class Child1 extends Pkg1 {}

class Pkg2 {}
class Child2 extends Pkg2 {}

const obj = new Object();
const pkg1 = new Pkg1();
const pkg2 = new Pkg2();
const child1 = new Child1();
const child2 = new Child2();

function runTests(stage) {
	// Everything is an instanceof Object
	assert(pkg1 instanceof Object);
	assert(pkg2 instanceof Object);
	assert(child1 instanceof Object);
	assert(child2 instanceof Object);

	// obj is not an instanceof anything except Object
	assert(obj instanceof Object);
	assert(obj instanceof Pkg1 === false);
	assert(obj instanceof Pkg2 === false);
	assert(obj instanceof Child1 === false);
	assert(obj instanceof Child2 === false);

	// Identity instanceof checks
	assert(pkg1 instanceof Pkg1);
	assert(pkg2 instanceof Pkg2);
	assert(child1 instanceof Child1);
	assert(child2 instanceof Child2);

	// pkg1 / pkg2 are not instanceof Child1 / Child2
	assert(pkg1 instanceof Child1 === false);
	assert(pkg1 instanceof Child2 === false);
	assert(pkg2 instanceof Child1 === false);
	assert(pkg2 instanceof Child2 === false);

	// Direct child tests
	assert(child1 instanceof Pkg1);
	assert(child2 instanceof Pkg2);

	// These pass once the unifier is installed to Pkg1 / Pkg2
	assert(pkg1 instanceof Pkg2 === stage > 0);
	assert(pkg2 instanceof Pkg1 === stage > 0);
	assert(child1 instanceof Pkg2 === stage > 0);
	assert(child2 instanceof Pkg1 === stage > 0);

	assert(child1 instanceof Child2 === stage > 1);
	assert(child2 instanceof Child1 === stage > 1);
}

runTests(0);

installUnifier(Pkg1, 'instanceof-unifier@1:Pkg');
installUnifier(Pkg2, 'instanceof-unifier@1:Pkg');

runTests(1);

installUnifier(Child1, 'instanceof-unifier@1:Child');
installUnifier(Child2, 'instanceof-unifier@1:Child');

runTests(2);

console.log('All tests passed');
