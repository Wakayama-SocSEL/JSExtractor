"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandLineValues_1 = require("./Common/CommandLineValues");
const ProgramRelation_1 = require("./FeaturesEntities/ProgramRelation");
const ExtractFeaturesTask_1 = require("./ExtractFeaturesTask");
const fs = require("fs");
const s_CommandLineValues = new CommandLineValues_1.default();
const FileType = {
    File: "file",
    Directory: "directory",
    Unknown: "unknown",
};
const getFileType = (path) => {
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
    }
    catch (e) {
        return FileType.Unknown;
    }
};
const listFiles = (dirPath) => {
    const ret = [];
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
    return ret;
};
const extractDir = () => {
    const files = listFiles(s_CommandLineValues.Dir);
    for (const file of files) {
        try {
            if (file.endsWith(".js")) {
                const extractFeaturesTask = new ExtractFeaturesTask_1.default(s_CommandLineValues, file);
                extractFeaturesTask.processFile();
            }
        }
        catch (e) {
            console.error(e);
            continue;
        }
    }
};
if (s_CommandLineValues.NoHash) {
    ProgramRelation_1.default.setNoHash();
}
if (s_CommandLineValues.File != null && s_CommandLineValues.File.endsWith(".js")) {
    const extractFeaturesTask = new ExtractFeaturesTask_1.default(s_CommandLineValues, s_CommandLineValues.File);
    extractFeaturesTask.processFile();
}
else if (s_CommandLineValues.Dir != null) {
    extractDir();
}
