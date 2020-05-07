"use strict";

import { ASTPath } from "jscodeshift";
import { Node } from "ast-types/gen/nodes";
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

export const isMethod = (node: ASTPath<Node>): boolean => {
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
  const strArray = str2.split(/(?<=[a-z])(?=[A-Z])|_|[0-9]|(?<=[A-Z])(?=[A-Z][a-z])|\s+/);
  return strArray
    .filter((s) => s.length > 0)
    .map((s) => normalizeName(s, EmptyString))
    .filter((s) => s.length > 0);
};
