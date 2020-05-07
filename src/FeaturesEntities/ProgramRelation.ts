"use strict";
import Property from "./Property";

export default class ProgramRelation {
  private m_Source: Property;
  private m_Target: Property;
  private m_HashedPath: string;
  private m_Path: string;

  private result: string[];

  private static noHash = false;

  static setNoHash = (): void => {
    ProgramRelation.noHash = true;
  };

  s_Hasher = (s: string): string => {
    // if (ProgramRelation.noHash)
    return s;
  };

  constructor(sourceName: Property, targetName: Property, path: string) {
    this.m_Source = sourceName;
    this.m_Target = targetName;
    this.m_Path = path;
    this.m_HashedPath = this.s_Hasher(path);
  }

  toString = (): string => {
    return `${this.m_Source.getName()},${this.m_HashedPath},${this.m_Target.getName()}`;
  };

  getPath = (): string => {
    return this.m_Path;
  };

  getSource = (): Property => {
    return this.m_Source;
  };

  getTarget = (): Property => {
    return this.m_Target;
  };

  getHashedPath = (): string => {
    return this.m_HashedPath;
  };
}
