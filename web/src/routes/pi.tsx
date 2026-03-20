import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "~/components/chat/ChatPanel";

export const Route = createFileRoute("/pi")({
  head: () => ({
    meta: [{ title: "Autonoma — Pi Agent" }],
  }),
  component: PiAgentPage,
});

function PiAgentPage() {
  return <ChatPanel />;
}
