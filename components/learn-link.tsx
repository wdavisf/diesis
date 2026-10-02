"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import type { TrackId } from "@/lib/i18n";
import { useLearnPath, useRememberTrack } from "@/lib/game/use-learn-track";

/** A link into Learn that opens the track the player was in last. `base` is "" or "/es". */
export function LearnLink({ base, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { base: string }) {
  return <Link href={useLearnPath(base)} {...props} />;
}

/** Drawn by a track's page so that Learn opens there next time. */
export function RememberTrack({ id }: { id: TrackId }) {
  useRememberTrack(id);
  return null;
}
