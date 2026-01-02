import { UserIcon } from "@heroicons/react/20/solid";
import { type ReactNode, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const avatarVariants = tv({
	slots: {
		root: [
			"relative inline-flex shrink-0 items-center justify-center overflow-hidden",
		],
		image: "size-full object-cover",
		fallback: "flex size-full items-center justify-center font-medium",
		placeholder: "flex size-full items-center justify-center",
	},
	variants: {
		size: {
			xs: {
				root: "size-6",
				fallback: "text-xs",
			},
			sm: {
				root: "size-8",
				fallback: "text-sm",
			},
			md: {
				root: "size-10",
				fallback: "text-base",
			},
			lg: {
				root: "size-12",
				fallback: "text-lg",
			},
		},
		color: {
			slate: {
				root: "bg-slate-100",
				fallback: "text-slate-700",
				placeholder: "text-slate-400",
			},
			sky: {
				root: "bg-sky-100",
				fallback: "text-sky-700",
				placeholder: "text-sky-400",
			},
			emerald: {
				root: "bg-emerald-100",
				fallback: "text-emerald-700",
				placeholder: "text-emerald-400",
			},
			rose: {
				root: "bg-rose-100",
				fallback: "text-rose-700",
				placeholder: "text-rose-400",
			},
			fuchsia: {
				root: "bg-fuchsia-100",
				fallback: "text-fuchsia-700",
				placeholder: "text-fuchsia-400",
			},
		},
		radius: {
			none: {
				root: "rounded-none",
			},
			sm: {
				root: "rounded-sm",
			},
			md: {
				root: "rounded-md",
			},
			lg: {
				root: "rounded-lg",
			},
			full: {
				root: "rounded-full",
			},
		},
	},
	defaultVariants: {
		size: "md",
		color: "slate",
		radius: "full",
	},
});

const getInitials = (name?: string, limit = 2) => {
	if (!name) {
		return "";
	}

	const parts = name.split(" ");

	if (parts.length === 1) {
		return name.slice(0, limit).toUpperCase();
	}

	return parts
		.map((word) => word[0])
		.slice(0, limit)
		.join("")
		.toUpperCase();
};

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
	src?: string;
	alt?: string;
	name?: string;
	placeholder?: ReactNode;
}

export const Avatar = ({
	src,
	alt,
	name,
	placeholder,
	size,
	color,
	radius,
}: AvatarProps) => {
	const [error, setError] = useState(false);

	const styles = avatarVariants({ size, color, radius });
	const showImage = src && !error;
	const initials = getInitials(name);

	return (
		<div className={styles.root()} data-slot="avatar">
			{showImage && (
				<img
					src={src}
					alt={alt || name || "Avatar"}
					data-slot="avatar-image"
					className={styles.image()}
					onError={() => setError(true)}
					onLoad={() => setError(false)}
				/>
			)}
			{!showImage && initials && (
				<span data-slot="avatar-fallback" className={styles.fallback()}>
					{initials}
				</span>
			)}
			{!showImage && !initials && (
				<span data-slot="avatar-placeholder" className={styles.placeholder()}>
					{placeholder || <UserIcon className="size-1/2" title={alt || ""} />}
				</span>
			)}
		</div>
	);
};
