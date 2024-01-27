import { memo } from "react";
import { ChipIcon, UserCircleIcon } from "@heroicons/react/outline";
import { Message, MessageRole } from "../../types";

const MessageItem = ({ content, role } : Omit<Message, 'id'>) => {
    return (
        <div className="flex gap-2 p-1 md:p-4 mb-3">
            <div className="w-7 flex-none">
                {
                    role == MessageRole.Assistant
                        ? <ChipIcon className="text-orange-600" />
                        : <UserCircleIcon className="text-teal-300" />
                }
            </div>
            <div className="p-1">
                {content}
            </div>
        </div>
    );
};

export default memo(MessageItem);