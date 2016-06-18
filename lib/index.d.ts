export interface Node {
    label: string;
    nodes: Node[];
}
export interface ChildrenOfFun {
    (parent: string, data: any): string[];
}
export default function archify(label: string, data: any, childrenOf: ChildrenOfFun): any;
