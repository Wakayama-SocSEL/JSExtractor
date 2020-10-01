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
    try {
      features = this.extractSingleFile();
    } catch (e) {
      console.error(e);
      return;
    }
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
    try {
      jscodeshift(readFileSync(this.path, Common.UTF8).toString())
        .find(jscodeshift.Function)
        .filter((path) => {
          return Common.getName(path) !== null;
        })
        .forEach((path) => {
          const featureExtractor = new FeatureExtractor(this.m_CommandLineValues);
          features.push(featureExtractor.extractFeatures(path));
        });
    } catch (e) {
      console.error(e);
      return [];
    }

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
