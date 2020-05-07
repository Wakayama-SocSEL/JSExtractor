"use strict";
import CommandLineValues from "./Common/CommandLineValues";
import MethodContent from "./Common/MethodContent";
import ProgramFeatures from "./FeaturesEntities/ProgramFeatures";
import * as Common from "./Common/Common";
import { ASTPath } from "jscodeshift";
import { namedTypes as n } from "ast-types";
import { Node } from "ast-types/gen/nodes";

const getTreeStack = (node: ASTPath<Node>): ASTPath<Node>[] => {
  const upStack: ASTPath<Node>[] = [];
  let current: ASTPath<Node> = node;
  while (current != null) {
    upStack.push(current);
    current = current.parentPath;
  }

  return upStack;
};

export default class FeatureExtractor {
  private m_CommandLineValues: CommandLineValues;

  constructor(commandLineValues: CommandLineValues) {
    this.m_CommandLineValues = commandLineValues;
  }

  private saturateChildId = (childId: number): number => {
    return Math.min(childId, this.m_CommandLineValues.MaxChildId);
  };

  public generatePathFeatures = (methods: MethodContent[]): ProgramFeatures[] => {
    const methodsFeatures: ProgramFeatures[] = [];
    for (const content of methods) {
      if (
        content.getLength() < this.m_CommandLineValues.MinCodeLength ||
        content.getLength() > this.m_CommandLineValues.MaxCodeLength
      ) {
        continue;
      }
    }

    return methodsFeatures;
  };

  public generatePathFeaturesForFunction = (methodContent: MethodContent): ProgramFeatures => {
    const functionLeaves = methodContent.getLeaves();
    const programFeatures = new ProgramFeatures(methodContent.getName());

    for (let i = 0; i < functionLeaves.length; i++) {
      for (let j = i + 1; j < functionLeaves.length; j++) {
        const separator = Common.EmptyString;

        const path = this.generatePath(functionLeaves[i], functionLeaves[j], separator);

        if (path != Common.EmptyString) {
        }
      }
    }

    return programFeatures;
  };

  private generatePath = (
    source: ASTPath<Node>,
    target: ASTPath<Node>,
    separator: string
  ): string => {
    const down = "_";
    const up = "^";
    const startSymbol = "(";
    const endSymbol = ")";

    const sourceStack = getTreeStack(source);
    const targetStack = getTreeStack(target);

    let commonPrefix = 0;
    let currentSourceAncestorIndex = sourceStack.length - 1;
    let currentTargetAncestorIndex = targetStack.length - 1;

    while (
      currentSourceAncestorIndex >= 0 &&
      currentTargetAncestorIndex >= 0 &&
      sourceStack[currentSourceAncestorIndex] == targetStack[currentTargetAncestorIndex]
    ) {
      commonPrefix++;
      currentSourceAncestorIndex--;
      currentTargetAncestorIndex--;
    }

    const pathLength = sourceStack.length + targetStack.length - 2 * commonPrefix;
    if (pathLength > this.m_CommandLineValues.MaxPathLength) {
      return Common.EmptyString;
    }

    if (currentSourceAncestorIndex >= 0 && currentTargetAncestorIndex >= 0) {
    }
  };
}
