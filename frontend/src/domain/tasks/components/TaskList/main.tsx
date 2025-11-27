import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from '../TaskItem';
import { Skeleton } from '@/core/components/skeleton';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/core/components/empty';
import { ClipboardList } from 'lucide-react';
import type { TaskFilters } from '../../types';

interface TaskListProps {
  filters?: TaskFilters;
}

export function TaskList({ filters }: TaskListProps) {
  const { data: tasks, isLoading, isError } = useTasks(filters);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive/20 bg-destructive/5 text-destructive flex h-40 items-center justify-center rounded-lg border">
        Erro ao carregar tarefas. Tente novamente.
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <ClipboardList />
        </EmptyMedia>
        <EmptyTitle>Nenhuma tarefa encontrada</EmptyTitle>
        <EmptyDescription>
          Você não possui tarefas com os filtros selecionados. Crie uma nova tarefa para começar.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskItem key={task.task_id} task={task} />
      ))}
    </div>
  );
}
