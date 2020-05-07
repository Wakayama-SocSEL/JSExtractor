// import jcs from "jscodeshift";
// import fs from "fs";
// import path from "path";
import MethodContent from "./Common/MethodContent";
import * as Common from "./Common/Common";
import { ASTPath } from "jscodeshift";
import { ASTNode, namedTypes as n } from "ast-types";
import * as recast from "recast";

/**
 * @param {import("jscodeshift").FileInfo} file
 * @param {import("jscodeshift").API} api
 * @param {import("jscodeshift").Options} options
 */
module.exports = (
  file: import("jscodeshift").FileInfo,
  api: import("jscodeshift").API,
  options: import("jscodeshift").Options
): any => {
  try {
    const j = api.jscodeshift;
    const root = j(file.source);
    const detected = root
      .find(j.Function)
      // .filter((path) => {
      //   return !!path.value.id;
      // })
      .forEach((path) => {
        // console.log(path.value);
        // const normalizedMethodName = Common.normalizeName(path.value.id.name, Common.BlankWord);
        // const splitNameParts = Common.splitToSubtokens(path.value.id.name);
        // const splitName =
        //   splitNameParts.length > 0 ? splitNameParts.join("|") : normalizedMethodName;
        console.log(path.value);
        console.log(
          path.value.loc["tokens"]
            .slice(path.value.loc.start["token"], path.value.loc.end["token"])
            .map((v) => {
              return v.value;
            })
            .join(" ")
        );
      });

    // if (detected > 0) {
    // const out = [path.basename(__filename, '.js'), file.path, detected].join(',');
    // console.log(out)
    // fs.appendFileSync(path.join(path.dirname(path.dirname(__dirname)), 'res', 'result.csv'), out + '\n');
    // }

    return null;
  } catch (err) {
    // console.error(err)
    return null;
  }
};
