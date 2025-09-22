import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { ChatMessage, Conversation, Agent } from '@/types/chat';

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery<ChatMessage[]>({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/conversations', { title });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, content, isUser, agentId }: {
      conversationId: string;
      content: string;
      isUser: boolean;
      agentId?: string;
    }) => {
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content,
        isUser,
        agentId,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations', variables.conversationId, 'messages'] 
      });
    },
  });
}

export function useClearMessages() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (conversationId: string) => {
      await apiRequest('DELETE', `/api/conversations/${conversationId}/messages`);
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations', conversationId, 'messages'] 
      });
    },
  });
}

export function useChat() {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();
  const clearMessages = useClearMessages();

  const startNewConversation = useCallback(async (title: string = 'New Conversation') => {
    try {
      const conversation = await createConversation.mutateAsync(title);
      setCurrentConversation(conversation.id);
      return conversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  }, [createConversation]);

  const sendUserMessage = useCallback(async (content: string) => {
    if (!currentConversation || !currentAgent) return;

    try {
      // Send user message
      await sendMessage.mutateAsync({
        conversationId: currentConversation,
        content,
        isUser: true,
      });

      // Simulate typing and agent response
      setIsTyping(true);
      
      setTimeout(async () => {
        const agentResponse = generateMockResponse(content, currentAgent);
        await sendMessage.mutateAsync({
          conversationId: currentConversation,
          content: agentResponse,
          isUser: false,
          agentId: currentAgent.id,
        });
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  }, [currentConversation, currentAgent, sendMessage]);

  const clearCurrentConversation = useCallback(async () => {
    if (!currentConversation) return;
    
    try {
      await clearMessages.mutateAsync(currentConversation);
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  }, [currentConversation, clearMessages]);

  // Auto-create conversation if none exists
  useEffect(() => {
    if (!currentConversation) {
      startNewConversation();
    }
  }, [currentConversation, startNewConversation]);

  return {
    currentConversation,
    setCurrentConversation,
    currentAgent,
    setCurrentAgent,
    isTyping,
    sendUserMessage,
    clearCurrentConversation,
    startNewConversation,
  };
}

function generateMockResponse(userMessage: string, agent: Agent): string {
  const responses = {
    assistant: [
      "I'd be happy to help you with that! Could you provide more details about what you're looking for?",
      "That's an interesting question. Let me break this down for you.",
      "Based on what you've mentioned, here are a few approaches we could take.",
      "I understand your concern. Let's work through this step by step."
    ],
    researcher: [
      "Let me research that for you. Based on current data and trends...",
      "I've analyzed similar cases, and here's what the research shows:",
      "According to recent studies and market analysis...",
      "My research indicates several key factors to consider:"
    ],
    coder: [
      "Here's how I would approach this from a technical perspective:",
      "Looking at the code structure, I'd recommend:",
      "From a development standpoint, consider these solutions:",
      "Let me walk you through the implementation details:"
    ]
  };

  const agentResponses = responses[agent.id as keyof typeof responses] || responses.assistant;
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}
