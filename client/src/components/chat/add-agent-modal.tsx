import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateAgent } from '@/hooks/use-agents';
import { useToast } from '@/hooks/use-toast';

interface AddAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAgentModal({ open, onOpenChange }: AddAgentModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  
  const createAgent = useCreateAgent();
  const { toast } = useToast();

  const colors = [
    'hsl(142.1 76.2% 36.3%)',
    'hsl(346.8 77.2% 49.8%)',
    'hsl(262.1 83.3% 57.8%)',
    'hsl(47.9 95.8% 53.1%)',
    'hsl(339.2 82.2% 51.4%)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !role.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAgent.mutateAsync({
        name: name.trim(),
        role: role.trim(),
        description: description.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
        avatar: name.charAt(0).toUpperCase(),
      });

      toast({
        title: "Success",
        description: "Agent created successfully",
      });

      // Reset form
      setName('');
      setRole('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="add-agent-modal">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Data Analyst"
              data-testid="input-agent-name"
            />
          </div>
          <div>
            <Label htmlFor="agent-role">Role</Label>
            <Input
              id="agent-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Data Analysis Expert"
              data-testid="input-agent-role"
            />
          </div>
          <div>
            <Label htmlFor="agent-description">Description</Label>
            <Textarea
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent specializes in..."
              rows={3}
              data-testid="input-agent-description"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-agent"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAgent.isPending}
              data-testid="button-add-agent"
            >
              {createAgent.isPending ? 'Adding...' : 'Add Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
