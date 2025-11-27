import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/core/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/dialog';
import { TaskList } from '@/domain/tasks/components/TaskList';
import { TaskForm } from '@/domain/tasks/components/TaskForm';
import { TaskFiltersBar } from '@/domain/tasks/components/TaskFilters';
import type { TaskFilters } from '@/domain/tasks/types';

function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Tarefas</h1>
          <p className="text-muted-foreground">Gerencie suas atividades diárias com eficiência.</p>
        </div>
        <div className="flex items-center gap-2">
          <TaskFiltersBar filters={filters} onFilterChange={setFilters} />
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <TaskForm onSuccess={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TaskList filters={filters} />
    </div>
  );
}

export { HomePage };
