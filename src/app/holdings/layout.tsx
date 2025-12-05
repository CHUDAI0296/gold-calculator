import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gold Holdings Tracker – Real-Time Value & P&L",
  description: "Record your gold holdings, see live spot-based valuations with FX conversion, and track profit & loss securely across devices.",
};

export default function HoldingsLayout({ children }: { children: ReactNode }) {
  return children;
}

