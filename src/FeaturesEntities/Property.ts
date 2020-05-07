"use strict";

import { ASTPath } from "jscodeshift";
import { namedTypes as n } from "ast-types";
import { Node } from "ast-types/gen/nodes";
import * as Common from "../Common/Common";

export default class Property {
  private RawType: string;
  private Type: string;
  private Name: string;
  private SplitName: string;
  private Operator: string;
  private NumericalKeepValues: string[] = ["0", "1", "32", "64"];

  constructor(node: ASTPath<Node>) {
    this.RawType = this.Type = node.value.type;

    this.Operator = "";
    if (
      n.BinaryExpression.check(node.value) ||
      n.UnaryExpression.check(node.value) ||
      n.AssignmentExpression.check(node.value)
    ) {
      this.Operator = node.value.operator;
    }

    if (this.Operator.length > 0) {
      this.Type += `:${this.Operator}`;
    }

    const nameToSplit = node.value.loc["tokens"]
      .slice(node.value.loc.start["token"], node.value.loc.end["token"])
      .map((v) => {
        return v.value;
      })
      .join(" ");

    const splitNameParts = Common.splitToSubtokens(nameToSplit);
    this.SplitName = splitNameParts.join(Common.internalSeparator);

    this.Name = Common.normalizeName(nameToSplit, Common.BlankWord);

    if (this.Name.length > Common.c_MaxLabelLength) {
      this.Name = this.Name.substring(0, Common.c_MaxLabelLength);
    }

    if (Common.isMethod(node, this.Type)) {
      this.Name = this.SplitName = Common.methodName;
    }

    if (this.SplitName.length === 0) {
      this.SplitName = this.Name;
      if (n.NumericLiteral && !this.NumericalKeepValues.includes(this.SplitName)) {
        this.SplitName = "<NUM>";
      }
    }
  }

  getRawType = (): string => {
    return this.RawType;
  };

  getType = (): string => {
    return this.Type;
  };

  getName = (): string => {
    return this.Name;
  };
}
