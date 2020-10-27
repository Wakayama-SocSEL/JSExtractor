import { ASTPath } from "jscodeshift";
import { namedTypes as n, getFieldNames, getFieldValue } from "ast-types";
import Property from "../FeaturesEntities/Property";

const isNode = (value: n.Node): boolean => {
  return !!(typeof value === "object" && value && "loc" in value);
};

export default class ProcessedNode {
  private parent: ProcessedNode;
  private path: ASTPath<n.Node>;
  private childId: number;
  private property: Property;
  private children: ProcessedNode[] = [];

  constructor(path: ASTPath<n.Node>, parent: ProcessedNode = null) {
    this.parent = parent;
    this.path = path;

    const fields = getFieldNames(path.value);
    const nodeFields: string[] = [];
    for (const field of fields) {
      const node = getFieldValue(path.value, field);
      if (isNode(node) || (Array.isArray(node) && node.length != 0)) {
        nodeFields.push(field);
      }
    }

    for (const key of nodeFields) {
      const child = path.get(key);
      if (Array.isArray(child.value)) {
        for (let index = 0; index < child.value.length; index++) {
          if (isNode(child.get(index).value)) {
            this.children.push(new ProcessedNode(child.get(index), this));
          }
        }
      } else {
        this.children.push(new ProcessedNode(child, this));
      }
    }
  }

  getParent = (): ProcessedNode => {
    return this.parent;
  };

  getASTPath = (): ASTPath<n.Node> => {
    return this.path;
  };

  setChildId = (id: number): void => {
    this.childId = id;
  };

  getChildId = (): number => {
    return this.childId;
  };

  setProperty = (property: Property): void => {
    this.property = property;
  };

  getProperty = (): Property => {
    return this.property;
  };

  getChildrenNodes = (): ProcessedNode[] => {
    return this.children;
  };
}
