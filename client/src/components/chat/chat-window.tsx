import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMessages } from '@/hooks/use-chat';
import { useAgents } from '@/hooks/use-agents';
import type { Agent } from '@/types/chat';

interface ChatWindowProps {
  conversationId: string | null;
  currentAgent: Agent | null;
  isTyping: boolean;
}

interface TypingIndicatorProps {
  agent: Agent;
}

function TypingIndicator({ agent }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="flex gap-3 max-w-xs lg:max-w-md xl:max-w-lg">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
          style={{ backgroundColor: agent.color }}
        >
          {agent.avatar}
        </div>
        <div className="flex-1">
          <div className="bg-card border border-border px-4 py-2 rounded-2xl rounded-bl-md">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({ conversationId, currentAgent, isTyping }: ChatWindowProps) {
  const { data: messages = [] } = useMessages(conversationId);
  const { data: agents = [] } = useAgents();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getMessageAgent = (agentId: string | null) => {
    if (!agentId) return null;
    return agents.find(agent => agent.id === agentId) || null;
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation by sending a message below.</p>
          </div>
        )}
        
        {messages.map((message) => {
          const messageAgent = getMessageAgent(message.agentId || null);
          
          if (message.isUser) {
            return (
              <div key={message.id} className="flex justify-end" data-testid={`message-user-${message.id}`}>
                <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-md">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.id} className="flex justify-start" data-testid={`message-agent-${message.id}`}>
                <div className="flex gap-3 max-w-xs lg:max-w-md xl:max-w-lg">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                    style={{ backgroundColor: messageAgent?.color || '#666' }}
                  >
                    {messageAgent?.avatar || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-card border border-border px-4 py-2 rounded-2xl rounded-bl-md">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {messageAgent?.name || 'Agent'} • {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
        
        {isTyping && currentAgent && <TypingIndicator agent={currentAgent} />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
