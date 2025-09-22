import { useState } from 'react';
import { Menu, Sun, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeContext } from '@/components/theme-provider';
import { useAgents } from '@/hooks/use-agents';
import { useChat } from '@/hooks/use-chat';
import { Sidebar } from '@/components/chat/sidebar';
import { MobileNav } from '@/components/chat/mobile-nav';
import { AgentSelector } from '@/components/chat/agent-selector';
import { ChatWindow } from '@/components/chat/chat-window';
import { ChatInput } from '@/components/chat/chat-input';
import { AddAgentModal } from '@/components/chat/add-agent-modal';
import type { NavigationSection } from '@/types/chat';

export default function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<NavigationSection>('home');
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useThemeContext();
  const { data: agents = [] } = useAgents();
  
  const {
    currentConversation,
    currentAgent,
    setCurrentAgent,
    isTyping,
    sendUserMessage,
    clearCurrentConversation,
  } = useChat();

  // Set default agent when agents are loaded
  if (!currentAgent && agents.length > 0) {
    setCurrentAgent(agents[0]);
  }

  const handleAgentSelect = (agent: typeof agents[0]) => {
    setCurrentAgent(agent);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        currentAgent={currentAgent}
        onAgentSelect={handleAgentSelect}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button variant="ghost" size="icon" data-testid="mobile-menu-toggle">
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Agent Selector */}
            {currentAgent && (
              <AgentSelector
                currentAgent={currentAgent}
                onAgentSelect={handleAgentSelect}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Add Agent Button */}
            <Button
              onClick={() => setShowAddAgentModal(true)}
              className="gap-2"
              data-testid="button-add-agent"
            >
              <Plus className="w-4 h-4" />
              Add Agent
            </Button>
          </div>
        </header>

        {/* Chat Window */}
        <ChatWindow
          conversationId={currentConversation}
          currentAgent={currentAgent}
          isTyping={isTyping}
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={sendUserMessage}
          onClear={clearCurrentConversation}
          disabled={isTyping || !currentAgent}
        />
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      )}

      {/* Add Agent Modal */}
      <AddAgentModal
        open={showAddAgentModal}
        onOpenChange={setShowAddAgentModal}
      />
    </div>
  );
}
