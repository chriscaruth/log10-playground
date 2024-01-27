export enum MessageRole {
    Assistant = 'assistant',
    User = 'user',
    System = 'system'
}

export interface Message {
    id: number;
    role: MessageRole;
    content: string;
}

export enum ChatModels {
    GPT3dot5Turbo = "gpt-3.5-turbo",
    GPT3dot5Turbo1106 = "gpt-3.5-turbo-1106",
    GPT3dot5Turbo16k = "gpt-3.5-turbo-16k",
    GPT4 = "gpt-4",
    GPT4TurboPreview = "gpt-4-turbo-preview"
}