import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useAgents } from '@/hooks/use-agents';
import type { Agent } from '@/types/chat';

interface AgentSelectorProps {
  currentAgent: Agent | null;
  onAgentSelect: (agent: Agent) => void;
}

export function AgentSelector({ currentAgent, onAgentSelect }: AgentSelectorProps) {
  const { data: agents = [] } = useAgents();

  if (!currentAgent) return null;

  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
        style={{ backgroundColor: currentAgent.color }}
      >
        {currentAgent.avatar}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Select
            value={currentAgent.id}
            onValueChange={(value) => {
              const agent = agents.find(a => a.id === value);
              if (agent) onAgentSelect(agent);
            }}
          >
            <SelectTrigger className="border-none p-0 h-auto bg-transparent focus:ring-0 text-lg font-semibold">
              {currentAgent.name}
            </SelectTrigger>
            <SelectContent data-testid="agent-selector-dropdown">
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id} data-testid={`select-agent-${agent.id}`}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: agent.color }}
                    >
                      {agent.avatar}
                    </div>
                    {agent.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{currentAgent.description}</p>
      </div>
    </div>
  );
}
