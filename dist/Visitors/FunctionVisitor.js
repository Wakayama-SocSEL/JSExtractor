"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MethodContent_1 = require("../Common/MethodContent");
const LeavesCollectorVisitor_1 = require("./LeavesCollectorVisitor");
const Common = require("../Common/Common");
const ProcessedNode_1 = require("./ProcessedNode");
const getMethodLength = (code) => {
    let cleanCode = code.replace(/\r\n/, "\n").replace(/\t/, " ");
    if (cleanCode.startsWith("{\n")) {
        cleanCode = cleanCode.substring(3).trim();
    }
    if (cleanCode.endsWith("\n}")) {
        cleanCode = cleanCode.substring(0, cleanCode.length - 2).trim();
    }
    return cleanCode.length;
};
class FunctionVisitor {
    constructor() {
        this.m_Methods = [];
        this.visitMethod = (node) => {
            const leavesCollectorVisitor = new LeavesCollectorVisitor_1.default();
            const parent = new ProcessedNode_1.default(node.parentPath);
            leavesCollectorVisitor.visitDepthFirst(new ProcessedNode_1.default(node, parent));
            const leaves = leavesCollectorVisitor.getLeaves();
            const normalizedMethodName = Common.normalizeName(Common.getName(node), Common.BlankWord);
            const splitNameParts = Common.splitToSubtokens(Common.getName(node));
            let splitName = normalizedMethodName;
            if (splitNameParts.length > 0) {
                splitName = splitNameParts.join(Common.internalSeparator);
            }
            const body = node.get("body");
            if (body.value !== undefined) {
                this.m_Methods.push(new MethodContent_1.default(leaves, splitName, getMethodLength(Common.nodeToString(body.value))));
            }
        };
        this.getMethodContents = () => {
            return this.m_Methods;
        };
    }
}
exports.default = FunctionVisitor;
