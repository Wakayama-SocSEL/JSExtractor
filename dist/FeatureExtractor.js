"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramFeatures_1 = require("./FeaturesEntities/ProgramFeatures");
const Common = require("./Common/Common");
const getTreeStack = (node) => {
    const upStack = [];
    let current = node;
    while (current != null) {
        upStack.push(current);
        current = current.parentPath;
    }
    return upStack;
};
class FeatureExtractor {
    constructor(commandLineValues) {
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
            }
        };
        this.m_CommandLineValues = commandLineValues;
    }
}
exports.default = FeatureExtractor;
