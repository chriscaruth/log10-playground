'use client'

import { useChat } from "@/app/context/ChatContext";
import useStream from "@/app/hooks/useStream";
import { Message, MessageRole } from "@/app/types";
import { ArrowUpIcon, StopIcon } from "@heroicons/react/outline";
import { Button } from "@tremor/react";
import { FormEvent, useState } from "react";

const MessageInput = () => {
    const [input, setInput] = useState("");
    const { state: { messages, config }, addUserMessage, updateAssistantMessage } = useChat();
    const { startStreaming, cancelStreaming } = useStream();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (processing) {
            endStream();
        } else {
            startStream();
        }
    }

    const startStream = async () => {
        var newMessage: Message = {
            id: messages.length + 1,
            role: MessageRole.User,
            content: input
        };

        setInput("");
        addUserMessage(newMessage);
        setProcessing(true);

        await startStreaming({
            url: "api",
            data: {
                messages: [...messages, newMessage].map(({ id, ...rest }) => rest),
                config: {
                    model: config.model
                }
            },
            onChunkReceived: updateAssistantMessage
        });

        setProcessing(false);
    }

    const endStream = () => {
        cancelStreaming();
        setProcessing(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2 border border-white/50 rounded-2xl p-2 font-white text-slate-400">
            <input
                value={input}
                className="bg-transparent flex-1 p-2 outline-none m-0"
                placeholder="Message"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            {processing
                ? <Button
                    className="pulse"
                    type="submit"
                    icon={StopIcon}
                />
                : <Button
                    disabled={input == ""}
                    type="submit"
                    icon={ArrowUpIcon}
                />
            }
        </form>
    );
}

export default MessageInput;