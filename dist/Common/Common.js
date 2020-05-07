"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_types_1 = require("ast-types");
exports.EmptyString = "";
exports.UTF8 = "utf-8";
exports.EvaluateTempDir = "EvalTemp";
exports.FieldAccessExpr = "FieldAccessExpr";
exports.ClassOrInterfaceType = "ClassOrInterfaceType";
exports.MethodDeclaration = "MethodDeclaration";
exports.NameExpr = "NameExpr";
exports.MethodCallExpr = "MethodCallExpr";
exports.DummyNode = "DummyNode";
exports.BlankWord = "BlankWord";
// eslint-disable-next-line @typescript-eslint/camelcase
exports.c_MaxLabelLength = 50;
exports.methodName = "METHOD_NAME";
exports.internalSeparator = "|";
exports.normalizeName = (original, defaultString) => {
    original = original
        .toLowerCase()
        .replace(/\\\n/, "")
        .replace(/\s+/g, "") // whitespaces
        .replace(/["',]/g, "") // quotes, apostrophies, commas
        .replace(/[^\w!"#$%&'()*+,-./:;<=>?@[\]^_`{\x20]/g, ""); // unicode weird characters
    const stripped = original.replace(/[^A-Za-z]/g, "");
    if (stripped.length == 0) {
        const carefulStripped = original.replace(/\s/g, "_");
        if (carefulStripped.length == 0) {
            return defaultString;
        }
        else {
            return carefulStripped;
        }
    }
    else {
        return stripped;
    }
};
exports.isMethod = (node, type) => {
    const parentProperty = node.parentPath;
    if (parentProperty == null) {
        return false;
    }
    else if (ast_types_1.namedTypes.Function.check(parentProperty.value)) {
    }
};
exports.splitToSubtokens = (str1) => {
    const str2 = str1.trim();
    const strArray = str2.split(/(?<=[a-z])(?=[A-Z])|_|[0-9]|(?<=[A-Z])(?=[A-Z][a-z])|\s+/);
    return strArray
        .filter((s) => s.length > 0)
        .map((s) => exports.normalizeName(s, exports.EmptyString))
        .filter((s) => s.length > 0);
};
