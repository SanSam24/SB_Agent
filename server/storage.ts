import { type Agent, type InsertAgent, type Conversation, type InsertConversation, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Agent methods
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  deleteAgent(id: string): Promise<void>;

  // Conversation methods
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;

  // Message methods
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessages(conversationId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private agents: Map<string, Agent>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;

  constructor() {
    this.agents = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.initializeDefaultAgents();
  }

  private initializeDefaultAgents() {
    const defaultAgents: Agent[] = [
      {
        id: "assistant",
        name: "Assistant",
        role: "General AI Assistant",
        description: "General AI assistant for various tasks",
        color: "hsl(221.2 83.2% 53.3%)",
        avatar: "A",
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: "researcher",
        name: "Researcher",
        role: "Research Specialist",
        description: "Specialized in research and data analysis",
        color: "hsl(262.1 83.3% 57.8%)",
        avatar: "R",
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: "coder",
        name: "Coder",
        role: "Programming Expert",
        description: "Expert in programming and software development",
        color: "hsl(24.6 95% 53.1%)",
        avatar: "C",
        isDefault: true,
        createdAt: new Date(),
      },
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values()).sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = {
      ...insertAgent,
      id,
      isDefault: false,
      createdAt: new Date(),
    };
    this.agents.set(id, agent);
    return agent;
  }

  async deleteAgent(id: string): Promise<void> {
    const agent = this.agents.get(id);
    if (agent && !agent.isDefault) {
      this.agents.delete(id);
    }
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async deleteConversation(id: string): Promise<void> {
    this.conversations.delete(id);
    // Also delete all messages in this conversation
    Array.from(this.messages.entries()).forEach(([messageId, message]) => {
      if (message.conversationId === id) {
        this.messages.delete(messageId);
      }
    });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      agentId: insertMessage.agentId ?? null,
      isUser: insertMessage.isUser ?? false,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    
    // Update conversation timestamp
    const conversation = this.conversations.get(insertMessage.conversationId);
    if (conversation) {
      conversation.updatedAt = new Date();
    }
    
    return message;
  }

  async deleteMessages(conversationId: string): Promise<void> {
    Array.from(this.messages.entries()).forEach(([messageId, message]) => {
      if (message.conversationId === conversationId) {
        this.messages.delete(messageId);
      }
    });
  }
}

export const storage = new MemStorage();
