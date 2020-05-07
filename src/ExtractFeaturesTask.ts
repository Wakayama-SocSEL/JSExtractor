"use strict";
import CommandLineValues from "./Common/CommandLineValues";

export default class ExtractFeaturesTask {
  private m_CommandLineValues: CommandLineValues;
  private path: string;

  constructor(commandLineValues: CommandLineValues, path: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.m_CommandLineValues = commandLineValues;
    this.path = path;
  }
}
