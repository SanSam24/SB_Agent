import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Agent } from '@/types/chat';

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ['/api/agents'],
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (agentData: Omit<Agent, 'id' | 'isDefault' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/agents', agentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (agentId: string) => {
      await apiRequest('DELETE', `/api/agents/${agentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
    },
  });
}
