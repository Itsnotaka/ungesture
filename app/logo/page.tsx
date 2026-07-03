import type { Metadata } from "next";
import { mark, site } from "../content";
import { LogoLab } from "./logo-lab";

export const instant = true;

export const metadata: Metadata = {
  title: `${mark.title} · ${site.title}`,
  description: mark.description,
  alternates: { canonical: `${site.url}/logo` },
};

export default function LogoPage() {
  return <LogoLab />;
}
