import { Link as ToolkitLink } from "@9bar/toolkit";
import { createLink } from "@tanstack/react-router";
import type { ComponentProps } from "react";

export const Link = createLink(ToolkitLink);

export type LinkProps = ComponentProps<typeof Link>;
