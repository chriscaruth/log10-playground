'use client'

import { Button, Select, SelectItem, Textarea } from "@tremor/react";
import { CogIcon, XIcon } from "@heroicons/react/outline";
import { useChat } from "@/app/context/ChatContext";
import { ChatModels } from "@/app/types";
import { useEffect, useState } from "react";

const ChatConfiguration = () => {
    const {
        state: {
            messages,
            config
        },
        updateSystemMessage,
        updateModel
    } = useChat();

    const [toggleMobile, setToggleMobile] = useState(false);

    const mobileConfigClasses = toggleMobile ? "fixed inset-0 bg-slate-900 p-6 z-10 pt-20" : "hidden";
    const desktopConfigClasses = "xl:block basis-1/4 bg-slate-900 p-6";

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setToggleMobile(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="fixed top-4 right-4 xl:hidden z-20">
                <Button onClick={() => setToggleMobile(prev => !prev)} icon={toggleMobile ? XIcon : CogIcon} />
            </div>
            <div className={`${mobileConfigClasses} ${desktopConfigClasses}`}>
                <div className="mb-6">
                    <label htmlFor="model">Model</label>
                    <Select
                        id="model"
                        value={config.model}
                        onValueChange={(value) => updateModel(value)}
                        enableClear={false}
                    >
                        {Object.values(ChatModels).map(model => (
                            <SelectItem key={model} value={model}>
                                {model}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="mb-6">
                    <label htmlFor="systemPrompt">System</label>
                    <Textarea
                        rows={10}
                        id="systemPrompt"
                        value={messages[0].content}
                        placeholder="System Prompt"
                        onChange={(e) => updateSystemMessage(e.target.value)}
                    />
                </div>
            </div>
        </>
    );
}

export default ChatConfiguration;