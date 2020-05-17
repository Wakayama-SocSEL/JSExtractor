"use strict";
import ProcessedNode from "../Visitors/ProcessedNode";

export default class MethodContent {
  private leaves: ProcessedNode[];
  private name: string;
  private length: number;

  constructor(leaves: ProcessedNode[], name: string, length: number) {
    this.leaves = leaves;
    this.name = name;
    this.length = length;
  }

  public getLeaves = (): ProcessedNode[] => {
    return this.leaves;
  };

  public getName = (): string => {
    return this.name;
  };

  public getLength = (): number => {
    return this.length;
  };
}
