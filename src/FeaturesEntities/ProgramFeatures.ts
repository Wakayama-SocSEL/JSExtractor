"use strict";

import ProgramRelation from "./ProgramRelation";
import Property from "./Property";

export default class ProgramFeatures {
  private name: string;
  private features: ProgramRelation[] = [];

  constructor(name: string) {
    this.name = name;
  }

  toString = (): string => {
    return `${this.name} ${this.features.join(" ")}`;
  };

  addFeature = (source: Property, path: string, target: Property): void => {
    const newRelation = new ProgramRelation(source, target, path);
    this.features.push(newRelation);
  };

  isEmpty = (): boolean => {
    return this.features.length === 0;
  };

  deleteAllPaths = (): void => {
    this.features = [];
  };

  getName = (): string => {
    return this.name;
  };

  getFeatures = (): ProgramRelation[] => {
    return this.features;
  };
}
