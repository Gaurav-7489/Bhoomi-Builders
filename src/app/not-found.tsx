import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section
      className="container"
      style={{ minHeight: "80svh", display: "grid", alignContent: "center", gap: 32, paddingTop: 120, paddingBottom: 80 }}
    >
      <span className="label">404</span>
      <h1 className="h-xl" style={{ maxWidth: "12ch" }}>
        This room <em>doesn’t</em> exist
      </h1>
      <p className="body-lg" style={{ maxWidth: "40ch" }}>
        The page you were looking for may have moved. Try our projects, or head back to the start.
      </p>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <Link href="/" className="text-link">
          Home <ArrowIcon />
        </Link>
        <Link href="/projects" className="text-link">
          Projects <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
