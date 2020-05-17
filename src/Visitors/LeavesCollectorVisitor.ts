"use strict";

import { namedTypes as n } from "ast-types";
import { ASTPath } from "jscodeshift";
import Property from "../FeaturesEntities/Property";
import ProcessedNode from "./ProcessedNode";

export default class LeavesCollectorVisitor {
  m_Leaves: ProcessedNode[] = [];

  visitDepthFirst = (node: ProcessedNode): void => {
    this.process(node);

    for (const child of node.getChildrenNodes()) {
      this.visitDepthFirst(child);
    }
  };

  process = (node: ProcessedNode): void => {
    if (n.Comment.check(node.getASTPath().value)) {
      return;
    }

    // let isLeaf = false;

    if (this.hasNoChildren(node) && this.isNotComment(node.getASTPath())) {
      this.m_Leaves.push(node);
      // isLeaf = true;
    }

    const childId = this.getChildId(node);
    node.setChildId(childId);
    const property = new Property(node.getASTPath());
    node.setProperty(property);
  };

  hasNoChildren = (node: ProcessedNode): boolean => {
    return node.getChildrenNodes().length === 0;
  };

  isNotComment = (node: ASTPath<n.Node>): boolean => {
    return !n.Comment.check(node.value) && !n.Statement.check(node.value);
  };

  getLeaves = (): ProcessedNode[] => {
    return this.m_Leaves;
  };

  getChildId = (node: ProcessedNode): number => {
    const parent = node.getParent();
    const parentsChildren = parent.getChildrenNodes();

    let childId = 0;
    for (const child of parentsChildren) {
      if (child === node) {
        return childId;
      }
      childId++;
    }

    return childId;
  };
}
