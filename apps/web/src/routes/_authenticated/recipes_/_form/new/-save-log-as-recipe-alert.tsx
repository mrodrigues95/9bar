import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@9bar/toolkit/components";
import type { Log } from "../../../../../utils/data";
import { formatShotAt } from "../../../../../utils/format";

interface SaveLogAsRecipeAlertProps {
	log: Log;
}

export const SaveLogAsRecipeAlert = ({ log }: SaveLogAsRecipeAlertProps) => {
	return (
		<Alert variant="info">
			<Info />
			<AlertTitle>New recipe from your {formatShotAt(log.shotAt)} shot</AlertTitle>
			<AlertDescription>Give it a name and adjust anything you want to change.</AlertDescription>
		</Alert>
	);
};
