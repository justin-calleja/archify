"use strict";
function archify(label, data, childrenOf) {
    var kids = childrenOf(label, data);
    return {
        label: label,
        nodes: kids.map(function (kid) { return archify(kid, data, childrenOf); })
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = archify;
