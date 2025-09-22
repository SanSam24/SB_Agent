import { Home, Users, Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavigationSection } from '@/types/chat';

interface MobileNavProps {
  activeSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
}

export function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  const navigationItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'agents' as const, icon: Users, label: 'Agents' },
    { id: 'history' as const, icon: Clock, label: 'History' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-40">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => onSectionChange(item.id)}
              data-testid={`mobile-nav-${item.id}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
