"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_types_1 = require("ast-types");
const isNode = (value) => {
    return !!(typeof value === "object" && value && "loc" in value);
};
class ProcessedNode {
    constructor(path, parent = null) {
        this.children = [];
        this.getParent = () => {
            return this.parent;
        };
        this.getASTPath = () => {
            return this.path;
        };
        this.setChildId = (id) => {
            this.childId = id;
        };
        this.getChildId = () => {
            return this.childId;
        };
        this.setProperty = (property) => {
            this.property = property;
        };
        this.getProperty = () => {
            return this.property;
        };
        this.getChildrenNodes = () => {
            return this.children;
        };
        this.parent = parent;
        this.path = path;
        const fields = ast_types_1.getFieldNames(path.value);
        const nodeFields = [];
        for (const field of fields) {
            const node = ast_types_1.getFieldValue(path.value, field);
            if (isNode(node) || (Array.isArray(node) && node.length != 0)) {
                nodeFields.push(field);
            }
        }
        for (const key of nodeFields) {
            const child = path.get(key);
            if (Array.isArray(child.value)) {
                for (let index = 0; index < child.value.length; index++) {
                    if (isNode(child.get(index).value)) {
                        this.children.push(new ProcessedNode(child.get(index), this));
                    }
                }
            }
            else {
                this.children.push(new ProcessedNode(child, this));
            }
        }
    }
}
exports.default = ProcessedNode;
