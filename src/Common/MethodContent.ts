"use strict";
import { Node } from "ast-types/gen/nodes";
import { ASTPath } from "jscodeshift";

export default class MethodContent {
  private leaves: ASTPath<Node>[];
  private name: string;
  private length: number;

  constructor(leaves: ASTPath<Node>[], name: string, length: number) {
    this.leaves = leaves;
    this.name = name;
    this.length = length;
  }

  public getLeaves = (): ASTPath<Node>[] => {
    return this.leaves;
  };

  public getName = (): string => {
    return this.name;
  };

  public getLength = (): number => {
    return this.length;
  };
}
