"use strict";
import CommandLineValues from "./Common/CommandLineValues";
import ProgramFeatures from "./FeaturesEntities/ProgramFeatures";
import * as Common from "./Common/Common";
import FeatureExtractor from "./FeatureExtractor";
import { readFileSync } from "fs";
import * as jscodeshift from "jscodeshift";

export default class ExtractFeaturesTask {
  private m_CommandLineValues: CommandLineValues;
  private path: string;

  constructor(commandLineValues: CommandLineValues, path: string) {
    this.m_CommandLineValues = commandLineValues;
    this.path = path;
  }

  processFile = (): void => {
    let features: ProgramFeatures[] = [];
    features = this.extractSingleFile();
    if (features == null) {
      return;
    }

    const toPrint = this.featuresToString(features).trim();
    if (toPrint.length > 0) {
      console.log(toPrint);
    }
  };

  extractSingleFile = (): ProgramFeatures[] => {
    const features = [];
    jscodeshift(readFileSync(this.path, Common.UTF8).toString(), {
      parser: require("recast/parsers/esprima"),
    })
      .find(jscodeshift.Function)
      .filter((path) => {
        return Common.getName(path) !== null;
      })
      .forEach((path) => {
        const featureExtractor = new FeatureExtractor(this.m_CommandLineValues);
        features.push(featureExtractor.extractFeatures(path));
      });

    return features;
  };

  featuresToString = (features: ProgramFeatures[]): string => {
    if (features == null || features.length === 0) {
      return Common.EmptyString;
    }

    const methodsOutputs: string[] = [];

    for (const singleMethodfeatures of features) {
      let toPrint = Common.EmptyString;
      toPrint = singleMethodfeatures.toString();
      if (this.m_CommandLineValues.PrettyPrint) {
        toPrint = toPrint.replace(/\s/, "\n\t");
      }

      methodsOutputs.push(toPrint);
    }
    return methodsOutputs.join("\n");
  };
}
