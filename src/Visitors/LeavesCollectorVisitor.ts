"use strict";

import { ASTNode } from "ast-types";

export default class LeavesCollectorVisitor {
  visitDepthFirst = (node: ASTNode) => {
    this.process(node);
  };

  process = (node: ASTNode) => {};
}
