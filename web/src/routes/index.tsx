import { createFileRoute } from "@tanstack/react-router";
import { InputSurface } from "~/components/input-surface/InputSurface";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Autonoma — Input Surface" }],
  }),
  component: InputSurfacePage,
});

function InputSurfacePage() {
  return <InputSurface />;
}
