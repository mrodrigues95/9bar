import { useEffect, useId, useRef } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Field,
	FieldLabel,
	Heading,
	Text,
	Textarea,
} from "@9bar/toolkit/components";
import type { PinnedTarget } from "../../utils/pins";

type PinComposerProps = {
	target: PinnedTarget;
	draft: string;
	onDraftChange: (draft: string) => void;
	onSave: () => void;
	onCancel: () => void;
};

export const PinComposer = ({
	target,
	draft,
	onDraftChange,
	onSave,
	onCancel,
}: PinComposerProps) => {
	const fieldId = useId();
	const fieldRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		fieldRef.current?.focus();
	}, []);

	return (
		<Card>
			<CardHeader>
				<Heading as="h2" variant="subsection">
					New pin
				</Heading>
				<Text variant="body-sm">
					{target.tag}
					{target.dataSlot !== null && ` · data-slot=${target.dataSlot}`}
				</Text>
			</CardHeader>
			<CardContent className="space-y-3">
				<code className="block overflow-x-auto rounded-md bg-muted px-2 py-1.5 font-mono text-xs">
					{target.selector}
				</code>
				{target.textSnippet && <Text variant="body-sm">“{target.textSnippet}”</Text>}
				<Field>
					<FieldLabel htmlFor={fieldId}>What should change here?</FieldLabel>
					<Textarea
						ref={fieldRef}
						id={fieldId}
						rows={3}
						value={draft}
						onChange={(event) => onDraftChange(event.target.value)}
						placeholder="e.g. Make this headline bigger and left-align it like variant B"
					/>
				</Field>
				<div className="flex flex-wrap gap-2">
					<Button size="sm" onPress={onSave} isDisabled={draft.trim().length === 0}>
						Save pin
					</Button>
					<Button size="sm" variant="ghost" onPress={onCancel}>
						Cancel (Esc)
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
