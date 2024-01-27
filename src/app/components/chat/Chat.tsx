import MessageList from "./MessageList"
import MessageInput from "./MessageInput";

const Chat = () => {
    return (
        <div className="flex flex-col xl:basis-3/4 h-full w-full p-4 md:p-6 md:container m-auto">
            <MessageList />
            <MessageInput />
        </div>
    )
}

export default Chat;