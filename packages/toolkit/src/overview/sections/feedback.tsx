import { CircleCheck, CloudOff, Info, Save, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components";

/** All five alert variants with espresso-flavored messages. */
export const FeedbackSection = () => (
	<div className="flex flex-col gap-3">
		<Alert>
			<Save />
			<AlertTitle>Recipe saved</AlertTitle>
			<AlertDescription>
				Your changes are synced across all devices.
			</AlertDescription>
		</Alert>
		<Alert variant="info">
			<Info />
			<AlertTitle>New roast detected</AlertTitle>
			<AlertDescription>
				A bag marked Honey Blend has a roast date newer than your current one.
			</AlertDescription>
		</Alert>
		<Alert variant="success">
			<CircleCheck />
			<AlertTitle>Shot logged</AlertTitle>
			<AlertDescription>
				28 s — 36 g yield. Right on target for this recipe.
			</AlertDescription>
		</Alert>
		<Alert variant="warning">
			<TriangleAlert />
			<AlertTitle>Dose drift</AlertTitle>
			<AlertDescription>
				Your last 3 shots averaged 17.6 g. Consider re-checking the grinder.
			</AlertDescription>
		</Alert>
		<Alert variant="destructive">
			<CloudOff />
			<AlertTitle>Sync failed</AlertTitle>
			<AlertDescription>
				Shot log couldn't be uploaded. Retrying in 5 minutes.
			</AlertDescription>
		</Alert>
	</div>
);
