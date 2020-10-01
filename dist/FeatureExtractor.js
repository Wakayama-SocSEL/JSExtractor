"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramFeatures_1 = require("./FeaturesEntities/ProgramFeatures");
const Common = require("./Common/Common");
const FunctionVisitor_1 = require("./Visitors/FunctionVisitor");
const getTreeStack = (node) => {
    const upStack = [];
    let current = node;
    while (current != null) {
        upStack.push(current);
        current = current.getParent();
    }
    return upStack;
};
class FeatureExtractor {
    constructor(commandLineValues) {
        this.extractFeatures = (path) => {
            const functionVisitor = new FunctionVisitor_1.default();
            functionVisitor.visitMethod(path);
            const methods = functionVisitor.getMethodContents();
            const programs = this.generatePathFeatures(methods);
            return programs;
        };
        this.saturateChildId = (childId) => {
            return Math.min(childId, this.m_CommandLineValues.MaxChildId);
        };
        this.generatePathFeatures = (methods) => {
            const methodsFeatures = [];
            for (const content of methods) {
                if (content.getLength() < this.m_CommandLineValues.MinCodeLength ||
                    content.getLength() > this.m_CommandLineValues.MaxCodeLength) {
                    continue;
                }
                const singleMethodFeatures = this.generatePathFeaturesForFunction(content);
                if (!singleMethodFeatures.isEmpty()) {
                    methodsFeatures.push(singleMethodFeatures);
                }
            }
            return methodsFeatures;
        };
        this.generatePathFeaturesForFunction = (methodContent) => {
            const functionLeaves = methodContent.getLeaves();
            const programFeatures = new ProgramFeatures_1.default(methodContent.getName());
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
        this.generatePath = (source, target, separator) => {
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
            while (currentSourceAncestorIndex >= 0 &&
                currentTargetAncestorIndex >= 0 &&
                sourceStack[currentSourceAncestorIndex] == targetStack[currentTargetAncestorIndex]) {
                commonPrefix++;
                currentSourceAncestorIndex--;
                currentTargetAncestorIndex--;
            }
            const pathLength = sourceStack.length + targetStack.length - 2 * commonPrefix;
            if (pathLength > this.m_CommandLineValues.MaxPathLength) {
                return Common.EmptyString;
            }
            if (currentSourceAncestorIndex >= 0 && currentTargetAncestorIndex >= 0) {
                const pathWidth = targetStack[currentTargetAncestorIndex].getChildId() -
                    sourceStack[currentSourceAncestorIndex].getChildId();
                if (pathWidth > this.m_CommandLineValues.MaxPathWidth) {
                    return Common.EmptyString;
                }
            }
            for (let i = 0; i < sourceStack.length - commonPrefix; i++) {
                const currentNode = sourceStack[i];
                let childId = Common.EmptyString;
                const parentRawType = currentNode.getParent().getProperty().getRawType();
                if (i === 0 ||
                    FeatureExtractor.s_ParentTypeToAddChildId.some((item) => {
                        return item === parentRawType;
                    })) {
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
            if (FeatureExtractor.s_ParentTypeToAddChildId.some((item) => {
                return item === commonNodeParentRawType;
            })) {
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
                if (i === 0 ||
                    FeatureExtractor.s_ParentTypeToAddChildId.some((item) => {
                        return item === currentNode.getProperty().getRawType();
                    })) {
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
        this.m_CommandLineValues = commandLineValues;
    }
}
exports.default = FeatureExtractor;
FeatureExtractor.s_ParentTypeToAddChildId = [
    "AssignmentExpression",
    "ArrayExpression",
    "MemberExpression",
    "CallExpression",
];
