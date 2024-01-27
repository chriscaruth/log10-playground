import { ChatProvider } from "./context/ChatContext";
import Chat from "./components/chat/Chat";
import ChatConfiguration from "./components/chat/ChatConfiguration";

export default function Home() {
    return (
        <ChatProvider>
            <div className="h-screen">
                <div className="flex flex-row h-full">
                    <ChatConfiguration />
                    <Chat />
                </div>
            </div>
        </ChatProvider>
    );
}
