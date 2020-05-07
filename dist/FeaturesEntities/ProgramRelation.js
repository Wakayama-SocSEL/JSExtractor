"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProgramRelation {
    constructor(sourceName, targetName, path) {
        this.s_Hasher = (s) => {
            // if (ProgramRelation.noHash)
            return s;
        };
        this.toString = () => {
            return `${this.m_Source.getName()},${this.m_HashedPath},${this.m_Target.getName()}`;
        };
        this.getPath = () => {
            return this.m_Path;
        };
        this.getSource = () => {
            return this.m_Source;
        };
        this.getTarget = () => {
            return this.m_Target;
        };
        this.getHashedPath = () => {
            return this.m_HashedPath;
        };
        this.m_Source = sourceName;
        this.m_Target = targetName;
        this.m_Path = path;
        this.m_HashedPath = this.s_Hasher(path);
    }
}
exports.default = ProgramRelation;
ProgramRelation.noHash = false;
ProgramRelation.setNoHash = () => {
    ProgramRelation.noHash = true;
};
