import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useAIChat = () => {
  const [loading, setLoading] = useState(false);
  const { apiKeys } = useGameStore();

  const sendMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, apiKey: apiKeys.gemini }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat error:', error);
      return 'Lo siento, hubo un error al procesar tu mensaje.';
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
