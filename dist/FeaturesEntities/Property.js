"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_types_1 = require("ast-types");
const Common = require("../Common/Common");
class Property {
    constructor(node) {
        this.NumericalKeepValues = ["0", "1", "32", "64"];
        this.getRawType = () => {
            return this.RawType;
        };
        this.getType = () => {
            return this.Type;
        };
        this.getName = () => {
            return this.Name;
        };
        this.RawType = this.Type = node.value.type;
        this.Operator = "";
        if (ast_types_1.namedTypes.BinaryExpression.check(node.value) ||
            ast_types_1.namedTypes.UnaryExpression.check(node.value) ||
            ast_types_1.namedTypes.AssignmentExpression.check(node.value)) {
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
        if (Common.isMethod(node)) {
            this.Name = this.SplitName = Common.methodName;
        }
        if (this.SplitName.length === 0) {
            this.SplitName = this.Name;
            if (ast_types_1.namedTypes.NumericLiteral && !this.NumericalKeepValues.includes(this.SplitName)) {
                this.SplitName = "<NUM>";
            }
        }
    }
}
exports.default = Property;
