import { namedTypes as n } from "ast-types";
import MethodContent from "../Common/MethodContent";
import { ASTPath } from "jscodeshift";
import LeavesCollectorVisitor from "./LeavesCollectorVisitor";
import * as Common from "../Common/Common";
import ProcessedNode from "./ProcessedNode";

const getMethodLength = (code: string): number => {
  let cleanCode = code.replace(/\r\n/, "\n").replace(/\t/, " ");
  if (cleanCode.startsWith("{\n")) {
    cleanCode = cleanCode.substring(3).trim();
  }
  if (cleanCode.endsWith("\n}")) {
    cleanCode = cleanCode.substring(0, cleanCode.length - 2).trim();
  }

  return cleanCode.length;
};

export default class FunctionVisitor {
  private m_Methods: MethodContent[] = [];

  visitMethod = (node: ASTPath<n.Node>): void => {
    const leavesCollectorVisitor = new LeavesCollectorVisitor();
    const parent = new ProcessedNode(node.parentPath);
    leavesCollectorVisitor.visitDepthFirst(new ProcessedNode(node, parent));
    const leaves = leavesCollectorVisitor.getLeaves();

    const normalizedMethodName = Common.normalizeName(Common.getName(node), Common.BlankWord);
    const splitNameParts = Common.splitToSubtokens(Common.getName(node));
    let splitName = normalizedMethodName;
    if (splitNameParts.length > 0) {
      splitName = splitNameParts.join(Common.internalSeparator);
    }

    const body: ASTPath<n.Node> = node.get("body");
    if (body.value !== undefined) {
      this.m_Methods.push(
        new MethodContent(leaves, splitName, getMethodLength(Common.nodeToString(body.value)))
      );
    }
  };

  getMethodContents = (): MethodContent[] => {
    return this.m_Methods;
  };
}
