"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramRelation_1 = require("./ProgramRelation");
class ProgramFeatures {
    constructor(name) {
        this.features = [];
        this.toString = () => {
            return `${this.name} ${this.features.join(" ")}`;
        };
        this.addFeature = (source, path, target) => {
            const newRelation = new ProgramRelation_1.default(source, target, path);
            this.features.push(newRelation);
        };
        this.isEmpty = () => {
            return this.features.length === 0;
        };
        this.deleteAllPaths = () => {
            this.features = [];
        };
        this.getName = () => {
            return this.name;
        };
        this.getFeatures = () => {
            return this.features;
        };
        this.name = name;
    }
}
exports.default = ProgramFeatures;
