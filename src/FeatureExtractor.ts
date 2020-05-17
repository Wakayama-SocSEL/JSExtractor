"use strict";
import CommandLineValues from "./Common/CommandLineValues";
import MethodContent from "./Common/MethodContent";
import ProgramFeatures from "./FeaturesEntities/ProgramFeatures";
import * as Common from "./Common/Common";
import ProcessedNode from "./Visitors/ProcessedNode";
import { ASTPath } from "jscodeshift";
import { namedTypes as n } from "ast-types";
import FunctionVisitor from "./Visitors/FunctionVisitor";

const getTreeStack = (node: ProcessedNode): ProcessedNode[] => {
  const upStack: ProcessedNode[] = [];
  let current: ProcessedNode = node;
  while (current != null) {
    upStack.push(current);
    current = current.getParent();
  }

  return upStack;
};

export default class FeatureExtractor {
  private m_CommandLineValues: CommandLineValues;
  private static s_ParentTypeToAddChildId = [
    "AssignmentExpression",
    "ArrayExpression",
    "MemberExpression",
    "CallExpression",
  ];

  constructor(commandLineValues: CommandLineValues) {
    this.m_CommandLineValues = commandLineValues;
  }

  extractFeatures = (path: ASTPath<n.Node>): ProgramFeatures[] => {
    const functionVisitor = new FunctionVisitor();

    functionVisitor.visitMethod(path);

    const methods = functionVisitor.getMethodContents();
    const programs = this.generatePathFeatures(methods);

    return programs;
  };

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
      const singleMethodFeatures = this.generatePathFeaturesForFunction(content);
      if (!singleMethodFeatures.isEmpty()) {
        methodsFeatures.push(singleMethodFeatures);
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
          const source = functionLeaves[i].getProperty();
          const target = functionLeaves[j].getProperty();
          programFeatures.addFeature(source, path, target);
        }
      }
    }

    return programFeatures;
  };

  private generatePath = (
    source: ProcessedNode,
    target: ProcessedNode,
    separator: string
  ): string => {
    const down = "_";
    const up = "^";
    const startSymbol = "(";
    const endSymbol = ")";

    let stringBuilder = "";
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
      const pathWidth =
        targetStack[currentTargetAncestorIndex].getChildId() -
        sourceStack[currentSourceAncestorIndex].getChildId();
      if (pathWidth > this.m_CommandLineValues.MaxPathWidth) {
        return Common.EmptyString;
      }
    }

    for (let i = 0; i < sourceStack.length - commonPrefix; i++) {
      const currentNode = sourceStack[i];
      let childId = Common.EmptyString;
      const parentRawType = currentNode.getParent().getProperty().getRawType();
      if (
        i === 0 ||
        FeatureExtractor.s_ParentTypeToAddChildId.some((item) => {
          return item === parentRawType;
        })
      ) {
        childId = this.saturateChildId(currentNode.getChildId()).toString();
      }

      stringBuilder =
        stringBuilder +
        separator +
        startSymbol +
        currentNode.getProperty().getType() +
        childId +
        endSymbol +
        up;
    }

    const commonNode = sourceStack[sourceStack.length - commonPrefix];
    let commonNodeChildId = Common.EmptyString;
    const parentNodeProperty = commonNode.getParent().getProperty();
    let commonNodeParentRawType = Common.EmptyString;
    if (parentNodeProperty != null) {
      commonNodeParentRawType = parentNodeProperty.getRawType();
    }
    if (
      FeatureExtractor.s_ParentTypeToAddChildId.some((item) => {
        return item === commonNodeParentRawType;
      })
    ) {
      commonNodeChildId = this.saturateChildId(commonNode.getChildId()).toString();
    }
    stringBuilder =
      stringBuilder +
      startSymbol +
      commonNode.getProperty().getType() +
      commonNodeChildId +
      endSymbol;

    for (let i = targetStack.length - commonPrefix - 1; i >= 0; i--) {
      const currentNode = targetStack[i];
      let childId = Common.EmptyString;
      if (
        i === 0 ||
        FeatureExtractor.s_ParentTypeToAddChildId.some((item) => {
          return item === currentNode.getProperty().getRawType();
        })
      ) {
        childId = this.saturateChildId(currentNode.getChildId()).toString();
      }
      stringBuilder =
        stringBuilder +
        down +
        startSymbol +
        currentNode.getProperty().getType() +
        childId +
        endSymbol;
    }

    return stringBuilder;
  };
}
