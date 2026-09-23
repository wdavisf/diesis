import type { Metadata } from "next";
import { Game } from "@/components/game";

export const metadata: Metadata = { title: "Name the note" };

export default function NameTheNotePage() {
  return <Game />;
}
