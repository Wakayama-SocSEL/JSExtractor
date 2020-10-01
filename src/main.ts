"use strict";

import CommandLineValues from "./Common/CommandLineValues";
import ProgramRelation from "./FeaturesEntities/ProgramRelation";
import ExtractFeaturesTask from "./ExtractFeaturesTask";
import * as fs from "fs";
import * as log4js from "log4js";

log4js.configure({
  appenders: {
    system: {
      type: "file",
      filename: "error.log",
    },
  },
  categories: {
    default: {
      appenders: ["system"],
      level: "error",
    },
  },
});
const logger = log4js.getLogger("system");

const s_CommandLineValues = new CommandLineValues();

const FileType = {
  File: "file",
  Directory: "directory",
  Unknown: "unknown",
};

const getFileType = (path: string): string => {
  try {
    const stat = fs.statSync(path);

    switch (true) {
      case stat.isFile():
        return FileType.File;

      case stat.isDirectory():
        return FileType.Directory;

      default:
        return FileType.Unknown;
    }
  } catch (e) {
    return FileType.Unknown;
  }
};

const listFiles = (dirPath: string): string[] => {
  const ret = [];
  try {
    const paths = fs.readdirSync(dirPath);

    paths.forEach((a) => {
      const path = `${dirPath}/${a}`;

      switch (getFileType(path)) {
        case FileType.File:
          ret.push(path);
          break;

        case FileType.Directory:
          ret.push(...listFiles(path));
          break;

        default:
        /* noop */
      }
    });
  } catch (e) {
    return [];
  }

  return ret;
};

const extractDir = (): void => {
  const files = listFiles(s_CommandLineValues.Dir);
  for (const file of files) {
    try {
      if (file.endsWith(".js")) {
        const extractFeaturesTask = new ExtractFeaturesTask(s_CommandLineValues, file);
        extractFeaturesTask.processFile();
      }
    } catch (e) {
      logger.error(file, e);
      continue;
    }
  }
};

if (s_CommandLineValues.NoHash) {
  ProgramRelation.setNoHash();
}

if (s_CommandLineValues.File != null && s_CommandLineValues.File.endsWith(".js")) {
  const extractFeaturesTask = new ExtractFeaturesTask(
    s_CommandLineValues,
    s_CommandLineValues.File
  );
  extractFeaturesTask.processFile();
} else if (s_CommandLineValues.Dir != null) {
  extractDir();
}
