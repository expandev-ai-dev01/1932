import { Button } from '@/core/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/dropdown-menu';
import { Filter } from 'lucide-react';
import type { TaskFilters, TaskPriority, TaskStatus } from '../../types';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

export function TaskFiltersBar({ filters, onFilterChange }: TaskFiltersProps) {
  const toggleStatus = (status: TaskStatus) => {
    const current = filters.status || [];
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ ...filters, status: next.length ? next : undefined });
  };

  const togglePriority = (priority: TaskPriority) => {
    const current = filters.priority || [];
    const next = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onFilterChange({ ...filters, priority: next.length ? next : undefined });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Filter className="size-3.5" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.status?.includes('Pendente')}
            onCheckedChange={() => toggleStatus('Pendente')}
          >
            Pendente
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status?.includes('Em Andamento')}
            onCheckedChange={() => toggleStatus('Em Andamento')}
          >
            Em Andamento
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status?.includes('Concluída')}
            onCheckedChange={() => toggleStatus('Concluída')}
          >
            Concluída
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.priority?.includes('Alta')}
            onCheckedChange={() => togglePriority('Alta')}
          >
            Alta
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.priority?.includes('Média')}
            onCheckedChange={() => togglePriority('Média')}
          >
            Média
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.priority?.includes('Baixa')}
            onCheckedChange={() => togglePriority('Baixa')}
          >
            Baixa
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
