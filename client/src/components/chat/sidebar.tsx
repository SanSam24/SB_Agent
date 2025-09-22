import { useState } from 'react';
import { Home, Users, Clock, Settings, ChevronLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAgents } from '@/hooks/use-agents';
import type { NavigationSection, Agent } from '@/types/chat';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
  currentAgent: Agent | null;
  onAgentSelect: (agent: Agent) => void;
  className?: string;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  activeSection,
  onSectionChange,
  currentAgent,
  onAgentSelect,
  className,
}: SidebarProps) {
  const { data: agents = [] } = useAgents();

  const navigationItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'agents' as const, icon: Users, label: 'Agents' },
    { id: 'history' as const, icon: Clock, label: 'History' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-70",
        "hidden lg:flex",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold">ChatAgents</h1>
              <p className="text-xs text-muted-foreground">Multi-Agent Interface</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => onSectionChange(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>

        {/* Agents List */}
        {!isCollapsed && (
          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Agents
            </h3>
            <div className="space-y-1">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    currentAgent?.id === agent.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onAgentSelect(agent)}
                  data-testid={`agent-${agent.id}`}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.avatar}
                  </div>
                  <span className="text-sm">{agent.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={onToggleCollapse}
          data-testid="sidebar-toggle"
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
          {!isCollapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}
