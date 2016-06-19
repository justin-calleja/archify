var assert = require('chai').assert;
var archify = require('../lib').default;
var data = require('./fixtures/abc');
var dOnly = require('./fixtures/dOnly');

function childrenOf(parent, data) {
  var indexInfo = data[parent];
  if (indexInfo === undefined) {
    return [];
  } else {
    var dependents = indexInfo.dependents;
    var depsLP = Object.keys(dependents.dependencyDependents).map(key => ({
      label: key,
      suffix: `.dependencies['${parent}']`
    }));
    var peerDepsLP = Object.keys(dependents.peerDependencyDependents).map(key => ({
      prefix: '[peer] ',
      label: key,
      suffix: `.peerDependencies['${parent}']`
    }));
    var devDepsLP = Object.keys(dependents.devDependencyDependents).map(key => ({
      prefix: '[dev] ',
      label: key,
      suffix: `.devDependencies['${parent}']`
    }));

    return depsLP.concat(peerDepsLP).concat(devDepsLP);
  }
}

// expected result:
// {
//   "label": "d",
//   "nodes": [
//     {
//       "label": "[peer] a.peerDependencies['d']",
//       "nodes": []
//     },
//     {
//       "label": "[dev] b.devDependencies['d']",
//       "nodes": [
//         {
//           "label": "a.dependencies['b']",
//           "nodes": []
//         }
//       ]
//     }
//   ]
// }
describe('#archify()', function() {
  it('correctly returns expected structure when root is d', function () {
    var res = archify('d', data, childrenOf);
    assert.equal(res.label, 'd', 'Root should have label of "d"');

    var aNode = res.nodes.find(node => node.label.startsWith('[peer] a'));
    assert.isFalse(aNode === undefined);
    assert.equal(aNode.label, '[peer] a.peerDependencies[\'d\']');
    assert.equal(aNode.nodes.length, 0, 'The depedent a has no dependents of its own');

    var bNode = res.nodes.find(node => node.label.startsWith('[dev] b'));
    assert.equal(bNode.label, '[dev] b.devDependencies[\'d\']');
    assert.equal(bNode.nodes.length, 1, 'The depedent b has one dependent of its own');

    var bNodeANode = bNode.nodes[0];
    assert.isFalse(bNodeANode === undefined);
    assert.equal(bNodeANode.label, 'a.dependencies[\'b\']');
  });

  it('correctly returns expected structure when root is d and data only has a node for d', function () {
    var res = archify('d', dOnly, childrenOf);
    assert.equal(res.label, 'd', 'Root should have label of "d"');

    var aNode = res.nodes.find(node => node.label.startsWith('[peer] a'));
    assert.isFalse(aNode === undefined);
    assert.equal(aNode.label, '[peer] a.peerDependencies[\'d\']');
    assert.equal(aNode.nodes.length, 0, 'The depedent a has no dependents of its own')

    var bNode = res.nodes.find(node => node.label.startsWith('[dev] b'));
    assert.equal(bNode.label, '[dev] b.devDependencies[\'d\']');
    assert.equal(bNode.nodes.length, 0, 'The depedent b has one dependent of its own ' +
      'but it should not show up as original data only had data about node d');
  });
});
