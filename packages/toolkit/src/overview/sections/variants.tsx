import { Plus, Search, Settings2 } from "lucide-react";
import {
	Badge,
	Button,
	Checkbox,
	IconButton,
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	Text,
	TextField,
} from "../../components";

/** Properties for the {@link Strip} component. */
interface StripProps {
	/** Caption naming the strip. */
	label: string;
	/** The demoed elements laid out in a wrapping row. */
	children: React.ReactNode;
}

/** A single variant strip: a labeled row of related demo elements. */
const Strip = ({ label, children }: StripProps) => (
	<div className="flex flex-col gap-3">
		<Text variant="label" color="secondary">
			{label}
		</Text>
		<div className="flex flex-wrap items-center gap-3">{children}</div>
	</div>
);

/** Grids of every component variant that the composed app sections don't naturally exercise. */
export const VariantsSection = () => (
	<div className="grid gap-8 lg:grid-cols-2">
		<div className="flex flex-col gap-8">
			<Strip label="Button variants">
				<Button variant="default">Default</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="destructive">Destructive</Button>
				<Button variant="link">Link</Button>
			</Strip>
			<Strip label="Button sizes">
				<Button size="xs">Extra small</Button>
				<Button size="sm">Small</Button>
				<Button>Default</Button>
				<Button size="lg">
					<Plus />
					Large
				</Button>
			</Strip>
			<Strip label="Icon buttons">
				<IconButton aria-label="Add recipe" variant="default" size="xs">
					<Plus />
				</IconButton>
				<IconButton aria-label="Add recipe" variant="default" size="sm">
					<Plus />
				</IconButton>
				<IconButton aria-label="Add recipe" variant="default">
					<Plus />
				</IconButton>
				<IconButton aria-label="Add recipe" variant="default" size="lg">
					<Plus />
				</IconButton>
				<IconButton aria-label="Recipe settings" variant="outline">
					<Settings2 />
				</IconButton>
				<IconButton aria-label="Recipe settings" variant="ghost">
					<Settings2 />
				</IconButton>
				<IconButton aria-label="Delete recipe" variant="destructive">
					<Plus />
				</IconButton>
			</Strip>
			<Strip label="Badge variants">
				<Badge>Default</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="outline">Outline</Badge>
				<Badge variant="ghost">Ghost</Badge>
				<Badge variant="destructive">Destructive</Badge>
				<Badge variant="link">Link</Badge>
			</Strip>
		</div>
		<div className="flex flex-col gap-8">
			<Strip label="Checkbox states">
				<Checkbox>Unchecked</Checkbox>
				<Checkbox defaultSelected>Checked</Checkbox>
				<Checkbox isIndeterminate>Indeterminate</Checkbox>
				<Checkbox isDisabled>Disabled</Checkbox>
				<Checkbox isInvalid>Invalid</Checkbox>
			</Strip>
			<Strip label="Text field states">
				<TextField label="Default" inputProps={{ defaultValue: "Honey Blend" }} />
				<TextField label="Disabled" isDisabled inputProps={{ defaultValue: "Honey Blend" }} />
				<TextField label="Readonly" isReadOnly inputProps={{ defaultValue: "Honey Blend" }} />
				<TextField
					label="Invalid"
					isInvalid
					errorMessage="Recipe names must be unique"
					inputProps={{ defaultValue: "Honey Blend" }}
				/>
			</Strip>
			<Strip label="Input group">
				<InputGroup aria-label="Dose">
					<InputGroupInput placeholder="18.0" type="number" step="0.1" />
					<InputGroupAddon align="inline-end">
						<InputGroupText>g</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup aria-label="Search beans">
					<InputGroupInput placeholder="Search beans..." />
					<InputGroupAddon align="inline-end">
						<InputGroupButton>
							<Search />
							Search
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</Strip>
		</div>
	</div>
);
