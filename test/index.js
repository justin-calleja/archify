var assert = require('chai').assert;
var archify = require('../lib').default;
var data = require('./fixtures/abc');

function childrenOf(parent, data) {
  var dependents = data[parent].dependents;
  var depsLP = dependents.dependencyDependents.map(dep => ({ label: dep.pkgJSON.name, suffix: `.dependencies['${parent}']` }));
  var peerDepsLP = dependents.peerDependencyDependents.map(peerDep => ({
    prefix: '[peer] ',
    label: peerDep.pkgJSON.name,
    suffix: `.peerDependencies['${parent}']`
  }));
  var devDepsLP = dependents.devDependencyDependents.map(devDep => ({
    prefix: '[dev] ',
    label: devDep.pkgJSON.name,
    suffix: `.devDependencies['${parent}']`
  }));

  return depsLP.concat(peerDepsLP).concat(devDepsLP);
}

suite('#archify()', function() {
  test('expect correct structure when root is d', function () {
    var res = archify('d', data, childrenOf);
    assert.equal(res.label, 'd', 'Root should have label of "d"');

    var aNode = res.nodes.find(node => node.label.startsWith('[peer] a'));
    assert.isFalse(aNode === undefined);
    assert.equal(aNode.label, '[peer] a.peerDependencies[\'d\']');
    assert.equal(aNode.nodes.length, 0, 'The depedent a has no dependents of its own')

    var bNode = res.nodes.find(node => node.label.startsWith('[dev] b'));
    assert.equal(bNode.label, '[dev] b.devDependencies[\'d\']');
    assert.equal(bNode.nodes.length, 1, 'The depedent b has one dependent of its own')

    var bNodeANode = bNode.nodes[0];
    assert.isFalse(bNodeANode === undefined);
    assert.equal(bNodeANode.label, 'a.dependencies[\'b\']');
  });
});
