"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LeavesCollectorVisitor {
    constructor() {
        this.visitDepthFirst = (node) => {
            this.process(node);
        };
        this.process = (node) => { };
    }
}
exports.default = LeavesCollectorVisitor;
