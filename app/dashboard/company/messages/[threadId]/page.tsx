import ChatWindow from "@/components/dashboard/messages/ChatWindow";


export default function ChatPage({ params }: { params: { threadId: string } }) {
return <ChatWindow threadId={params.threadId} />;
}