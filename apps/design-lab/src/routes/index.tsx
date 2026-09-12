import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/page-header";
import { designGroups } from "../components/registry/registry";
import { GroupSection } from "./-components/group-section";
import { HowTheLoopWorks } from "./-components/how-the-loop-works";

const DesignGallery = () => {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Design Lab"
				lede="Mock up variations, compare them side by side, pin feedback."
			/>
			<HowTheLoopWorks />
			{designGroups.map((group) => {
				return <GroupSection key={group.id} group={group} />;
			})}
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: DesignGallery,
});
