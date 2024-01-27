'use client'

import { ReactNode, createContext, useContext, useReducer } from "react";
import { ChatModels, Message, MessageRole } from "../types";

enum ChatActionType {
    UpdateAssistantMessage = 'UPDATE_ASSISTANT_MESSAGE',
    AddMessage = 'ADD_MESSAGE',
    UpdateSystemMessage = 'UPDATE_SYSTEM_MESSAGE',
    UpdateModel = 'UPDATE_MODEL'
}

interface ChatConfig {
    model: string;
}

interface ChatState {
    messages: Message[];
    config: ChatConfig;
    isAssisting: boolean;
}

interface UpdateAssistantMessageAction {
    type: ChatActionType.UpdateAssistantMessage;
    payload: string;
}

interface AddMessageAction {
    type: ChatActionType.AddMessage;
    payload: Message;
}

interface UpdateSystemMessageAction {
    type: ChatActionType.UpdateSystemMessage;
    payload: string;
}

interface UpdateModelAction {
    type: ChatActionType.UpdateModel,
    payload: string;
}

type UpdateMessageAction = UpdateAssistantMessageAction | UpdateSystemMessageAction;

type ChatAction = AddMessageAction | UpdateMessageAction | UpdateModelAction;

interface ChatContextValue {
    state: ChatState;
    updateAssistantMessage: (text: string) => void;
    updateSystemMessage: (text: string) => void;
    addUserMessage: (message: Message) => void;
    updateModel: (model: string) => void;
}

const ChatContext = createContext<ChatContextValue>({} as ChatContextValue);

const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
        case ChatActionType.UpdateAssistantMessage: 
            return updateMessageWithRole(state, action, state.messages.length - 1, MessageRole.Assistant);
        case ChatActionType.AddMessage:
            return { ...state, messages: [
                ...state.messages, 
                action.payload,
                {
                    id: state.messages.length + 2,
                    role: MessageRole.Assistant,
                    content: ""
                }
            ]};
        case ChatActionType.UpdateSystemMessage:
            return updateMessageWithRole(state, action, 0, MessageRole.System);
        case ChatActionType.UpdateModel:
            return { ...state, config: { ...state.config, model: action.payload }}
    }
}

export const ChatProvider = ({ children } : { children : ReactNode }) => {
    const [state, dispatch] = useReducer(chatReducer, { 
        messages: [{
            id: 1,
            role: MessageRole.System,
            content: ""
        }],
        config: {
            model: ChatModels.GPT3dot5Turbo
        },
        isAssisting: false
    });

    return (
        <ChatContext.Provider value={{
            state,
            updateAssistantMessage: (text: string) => dispatch({ type: ChatActionType.UpdateAssistantMessage, payload: text }),
            updateSystemMessage: (text: string) => dispatch({ type: ChatActionType.UpdateSystemMessage, payload: text }),
            addUserMessage: (message: Message) => dispatch({ type: ChatActionType.AddMessage, payload: message }),
            updateModel: (model: string) => dispatch({ type: ChatActionType.UpdateModel, payload: model })
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);

    if (context === null) {
        throw new Error('useChat must be used within a ChatProvider');
    }

    return context;
}

const updateMessageWithRole = (state: ChatState, action: UpdateMessageAction, index: number, role: MessageRole) => {
    const messages = [...state.messages];

    if (messages.length > 0 && messages[index].role === role) {
        messages[index] = { 
            ...messages[index], 
            content: role == MessageRole.Assistant 
                ? messages[index].content + action.payload 
                : action.payload 
        };
    }
    return { ...state, messages } 
}