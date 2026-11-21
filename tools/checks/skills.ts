import { existsSync } from "node:fs";
import { join } from "node:path";
import { fromRoot, readText, toRepoPath } from "./files.ts";

const FORKED_SKILLS = ["correct", "create-verification-skill", "maintain-verification-skill"];
const FORK_HEADER = /<!-- Forked from https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[0-9a-f]{40}\//u;

export const checkSkills = () =>
	FORKED_SKILLS.flatMap((name) => {
		const file = join(fromRoot(".agents/skills"), name, "SKILL.md");
		if (!existsSync(file) || FORK_HEADER.test(readText(file))) {
			return [];
		}
		return [
			{
				file: toRepoPath(file),
				problem: "forked skill has no fork header",
				fix: "Add `<!-- Forked from https://github.com/<owner>/<repo>/blob/<sha>/<path> (<license>). Local changes: … -->` right after the frontmatter.",
			},
		];
	});
