"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_types_1 = require("ast-types");
const Property_1 = require("../FeaturesEntities/Property");
class LeavesCollectorVisitor {
    constructor() {
        this.m_Leaves = [];
        this.visitDepthFirst = (node) => {
            this.process(node);
            for (const child of node.getChildrenNodes()) {
                this.visitDepthFirst(child);
            }
        };
        this.process = (node) => {
            if (ast_types_1.namedTypes.Comment.check(node.getASTPath().value)) {
                return;
            }
            // let isLeaf = false;
            if (this.hasNoChildren(node) && this.isNotComment(node.getASTPath())) {
                this.m_Leaves.push(node);
                // isLeaf = true;
            }
            const childId = this.getChildId(node);
            node.setChildId(childId);
            const property = new Property_1.default(node.getASTPath());
            node.setProperty(property);
        };
        this.hasNoChildren = (node) => {
            return node.getChildrenNodes().length === 0;
        };
        this.isNotComment = (node) => {
            return !ast_types_1.namedTypes.Comment.check(node.value) && !ast_types_1.namedTypes.Statement.check(node.value);
        };
        this.getLeaves = () => {
            return this.m_Leaves;
        };
        this.getChildId = (node) => {
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
}
exports.default = LeavesCollectorVisitor;
