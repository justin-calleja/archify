export interface Node {
  label: string;
  nodes: Node[];
}

export interface LabelParts {
  label: string,
  prefix?: string,
  suffix?: string
}

export interface ChildrenOfFun {
  (parent: string, data: any): LabelParts[];
}

export interface Opts {
  labelPrefix?: string,
  labelSuffix?: string
}

// Note: remember to access with .default from commonjs modules
// https://github.com/Microsoft/TypeScript/issues/2719
export default function archify(label: string, data: any, childrenOf: ChildrenOfFun, opts: Opts = {}): Node {
  var kids: LabelParts[] = childrenOf(label, data);
  var nodes = kids.map(kid => {
    var opts = {
      labelPrefix: kid.prefix,
      labelSuffix: kid.suffix
    };
    return archify(kid.label, data, childrenOf, opts);
  });

  return {
    label: (opts.labelPrefix || '') + label + (opts.labelSuffix || ''),
    nodes
  }
}
