import { eslintCompatPlugin } from "@oxlint/plugins";

import { noCommentsRule } from "./rules/no-comments.ts";
import { noEffectRule } from "./rules/no-effect.ts";
import { noManualMemoRule } from "./rules/no-manual-memo.ts";
import { noRuntimeTypeofRule } from "./rules/no-runtime-typeof.ts";
import { noForbiddenTermInSymbolNamesRule } from "./rules/no-shape-in-symbol-names.ts";
import { noUnknownParametersRule } from "./rules/no-unknown-parameters.ts";
import { maxClassStringLengthRule } from "./rules/max-class-string-length.ts";
import { reactAriaImportAliasRule } from "./rules/react-aria-import-alias.ts";
import { requireExportJsdocRule } from "./rules/require-export-jsdoc.ts";
import { typeNamingRule } from "./rules/type-naming.ts";
import { requireSafetyCommentForTypeAssertionRule } from "./rules/require-safety-comment-for-type-assertion.ts";

/** Generic Oxlint rules that reject low-evidence and low-signal implementation patterns. */
const antiSlopPlugin = eslintCompatPlugin({
	meta: { name: "anti-slop" },
	rules: {
		"no-comments": noCommentsRule,
		"no-effect": noEffectRule,
		"no-manual-memo": noManualMemoRule,
		"no-runtime-typeof": noRuntimeTypeofRule,
		"no-shape-in-symbol-names": noForbiddenTermInSymbolNamesRule,
		"no-unknown-parameters": noUnknownParametersRule,
		"max-class-string-length": maxClassStringLengthRule,
		"react-aria-import-alias": reactAriaImportAliasRule,
		"require-export-jsdoc": requireExportJsdocRule,
		"require-safety-comment-for-type-assertion": requireSafetyCommentForTypeAssertionRule,
		"type-naming": typeNamingRule,
	},
});

export default antiSlopPlugin;
