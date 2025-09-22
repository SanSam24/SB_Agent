export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  agentId?: string;
  createdAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  color: string;
  avatar: string;
  isDefault: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NavigationSection = 'home' | 'agents' | 'history' | 'settings';
