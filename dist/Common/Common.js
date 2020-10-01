"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getName = exports.nodeToString = exports.splitToSubtokens = exports.isMethod = exports.normalizeName = exports.internalSeparator = exports.methodName = exports.c_MaxLabelLength = exports.BlankWord = exports.DummyNode = exports.MethodCallExpr = exports.NameExpr = exports.MethodDeclaration = exports.ClassOrInterfaceType = exports.FieldAccessExpr = exports.EvaluateTempDir = exports.UTF8 = exports.EmptyString = void 0;
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
exports.isMethod = (node) => {
    if (!ast_types_1.namedTypes.Identifier.check(node.value)) {
        return false;
    }
    return (ast_types_1.namedTypes.Function.check(node.parentPath.value) ||
        (ast_types_1.namedTypes.VariableDeclarator.check(node.parentPath.value) &&
            ast_types_1.namedTypes.Function.check(node.parentPath.value.init)) ||
        ast_types_1.namedTypes.MethodDefinition.check(node.parentPath.value) ||
        (ast_types_1.namedTypes.ClassProperty.check(node.parentPath.value) && ast_types_1.namedTypes.Function.check(node.parentPath.value.value)));
};
exports.splitToSubtokens = (str1) => {
    const str2 = str1.trim();
    return str2
        .split(/(?<=[a-z])(?=[A-Z])|_|[0-9]|(?<=[A-Z])(?=[A-Z][a-z])|\s+/)
        .filter((s) => s.length > 0)
        .map((s) => exports.normalizeName(s, exports.EmptyString))
        .filter((s) => s.length > 0);
};
exports.nodeToString = (node) => {
    return node.loc["tokens"]
        .slice(node.loc.start["token"], node.loc.end["token"])
        .filter((v) => {
        return !ast_types_1.namedTypes.Comment.check(v);
    })
        .map((v) => {
        return v.value;
    })
        .join(" ");
};
exports.getName = (node) => {
    if (ast_types_1.namedTypes.FunctionDeclaration.check(node.value)) {
        return node.value.id.name;
    }
    else if ((ast_types_1.namedTypes.FunctionExpression.check(node.value) || ast_types_1.namedTypes.ArrowFunctionExpression.check(node.value)) &&
        ast_types_1.namedTypes.VariableDeclarator.check(node.parentPath.value)) {
        return node.parentPath.value.id.name;
    }
    else if ((ast_types_1.namedTypes.FunctionExpression.check(node.value) || ast_types_1.namedTypes.ArrowFunctionExpression.check(node.value)) &&
        (ast_types_1.namedTypes.MethodDefinition.check(node.parentPath.value) ||
            ast_types_1.namedTypes.ClassProperty.check(node.parentPath.value))) {
        return node.parentPath.value.key.name;
    }
    else {
        return null;
    }
};
