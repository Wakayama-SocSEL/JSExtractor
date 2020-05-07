"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MethodContent {
    constructor(leaves, name, length) {
        this.getLeaves = () => {
            return this.leaves;
        };
        this.getName = () => {
            return this.name;
        };
        this.getLength = () => {
            return this.length;
        };
        this.leaves = leaves;
        this.name = name;
        this.length = length;
    }
}
exports.default = MethodContent;
