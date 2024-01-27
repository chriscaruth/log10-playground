'use client'

import { useEffect, useRef } from "react";
import { MessageRole } from "@/app/types";
import MessageItem from "./MessageItem";
import { useChat } from "@/app/context/ChatContext";

const MessageList = () => {
    const { state: { messages } } = useChat();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col justify-end overflow-hidden">
            <div className="overflow-auto hide-scrollbar">
                {messages.filter(x => x.role != MessageRole.System).map((message) => (
                    <MessageItem key={message.id} role={message.role} content={message.content} />
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

export default MessageList;