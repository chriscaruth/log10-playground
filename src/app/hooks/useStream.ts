import { useState, useCallback } from 'react';

interface StreamingProps {
    data: Record<string, unknown>;
    url: string;
    onChunkReceived: (chunk: string) => void;
}

const useStream = () => {
    const [error, setError] = useState<Error | null>(null);
    let controller: AbortController | null = null;

    const startStreaming = useCallback(async ({ url, data, onChunkReceived }: StreamingProps) => {
        controller = new AbortController();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal: controller?.signal
            });

            const reader = response.body?.getReader();
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    var chunk = new TextDecoder().decode(value);

                    onChunkReceived(chunk);
                }
            } else {
                setError(new Error('There was an issue generating a response.'));
            }
        } catch (error) {
            if ((error as any).name === 'AbortError') {
                return null;
            }
            setError(error as Error);
        }
    }, []);

    const cancelStreaming = useCallback(() => {
        if (controller) {
            controller.abort();
            controller = null;
        }
    }, []);

    return { error, startStreaming, cancelStreaming };
};

export default useStream;