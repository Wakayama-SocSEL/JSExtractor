"use strict";

import { ASTPath } from "jscodeshift";
import { namedTypes as n } from "ast-types";

export const EmptyString = "";
export const UTF8 = "utf-8";
export const EvaluateTempDir = "EvalTemp";

export const FieldAccessExpr = "FieldAccessExpr";
export const ClassOrInterfaceType = "ClassOrInterfaceType";
export const MethodDeclaration = "MethodDeclaration";
export const NameExpr = "NameExpr";
export const MethodCallExpr = "MethodCallExpr";
export const DummyNode = "DummyNode";
export const BlankWord = "BlankWord";

// eslint-disable-next-line @typescript-eslint/camelcase
export const c_MaxLabelLength = 50;
export const methodName = "METHOD_NAME";
export const internalSeparator = "|";

export const normalizeName = (original: string, defaultString: string): string => {
  original = original
    .toLowerCase()
    .replace(/\\\n/, "")
    .replace(/\s+/g, "") // whitespaces
    .replace(/["',]/g, "") // quotes, apostrophies, commas
    .replace(/[^\w!"#$%&'()*+,-./:;<=>?@[\]^_`{\x20]/g, ""); // unicode weird characters
  const stripped: string = original.replace(/[^A-Za-z]/g, "");
  if (stripped.length == 0) {
    const carefulStripped = original.replace(/\s/g, "_");
    if (carefulStripped.length == 0) {
      return defaultString;
    } else {
      return carefulStripped;
    }
  } else {
    return stripped;
  }
};

export const isMethod = (node: ASTPath<n.Node>): boolean => {
  if (!n.Identifier.check(node.value)) {
    return false;
  }

  return (
    n.Function.check(node.parentPath.value) ||
    (n.VariableDeclarator.check(node.parentPath.value) &&
      n.Function.check(node.parentPath.value.init)) ||
    n.MethodDefinition.check(node.parentPath.value) ||
    (n.ClassProperty.check(node.parentPath.value) && n.Function.check(node.parentPath.value.value))
  );
};

export const splitToSubtokens = (str1: string): string[] => {
  const str2: string = str1.trim();
  return str2
    .split(/(?<=[a-z])(?=[A-Z])|_|[0-9]|(?<=[A-Z])(?=[A-Z][a-z])|\s+/)
    .filter((s) => s.length > 0)
    .map((s) => normalizeName(s, EmptyString))
    .filter((s) => s.length > 0);
};

export const nodeToString = (node: n.Node): string => {
  return node.loc["tokens"]
    .slice(node.loc.start["token"], node.loc.end["token"])
    .filter((v) => {
      return !n.Comment.check(v);
    })
    .map((v) => {
      return v.value;
    })
    .join(" ");
};

export const getName = (node: ASTPath<n.Node>): string => {
  if (n.FunctionDeclaration.check(node.value)) {
    return node.value.id.name;
  } else if (
    (n.FunctionExpression.check(node.value) || n.ArrowFunctionExpression.check(node.value)) &&
    n.VariableDeclarator.check(node.parentPath.value)
  ) {
    return node.parentPath.value.id.name;
  } else if (
    (n.FunctionExpression.check(node.value) || n.ArrowFunctionExpression.check(node.value)) &&
    (n.MethodDefinition.check(node.parentPath.value) ||
      n.ClassProperty.check(node.parentPath.value))
  ) {
    return node.parentPath.value.key.name;
  } else {
    return null;
  }
};
