import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "~/components/chat/ChatPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Autonoma — Chat" }],
  }),
  component: ChatPage,
});

function ChatPage() {
  return <ChatPanel />;
}
