"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Common = require("./Common/Common");
const FeatureExtractor_1 = require("./FeatureExtractor");
const fs_1 = require("fs");
const jscodeshift = require("jscodeshift");
const log4js = require("log4js");
const logger = log4js.getLogger("system");
class ExtractFeaturesTask {
    constructor(commandLineValues, path) {
        this.processFile = () => {
            let features = [];
            features = this.extractSingleFile();
            if (features == null) {
                return;
            }
            const toPrint = this.featuresToString(features).trim();
            if (toPrint.length > 0) {
                console.log(toPrint);
            }
            else {
                logger.error(this.path, "empty features");
            }
        };
        this.extractSingleFile = () => {
            const features = [];
            jscodeshift(fs_1.readFileSync(this.path, Common.UTF8).toString(), {
                parser: {
                    parse(source) {
                        return require("recast/parsers/babel").parse(source, {
                            sourceType: "script",
                        });
                    },
                },
            })
                .find(jscodeshift.Function)
                .filter((path) => {
                return Common.getName(path) !== null;
            })
                .forEach((path) => {
                try {
                    const featureExtractor = new FeatureExtractor_1.default(this.m_CommandLineValues);
                    features.push(featureExtractor.extractFeatures(path));
                }
                catch (e) {
                    logger.error(this.path, e);
                }
            });
            return features;
        };
        this.featuresToString = (features) => {
            if (features == null || features.length === 0) {
                return Common.EmptyString;
            }
            const methodsOutputs = [];
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
        this.m_CommandLineValues = commandLineValues;
        this.path = path;
    }
}
exports.default = ExtractFeaturesTask;
