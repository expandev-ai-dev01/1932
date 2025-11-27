import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreVertical, Calendar, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/core/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/core/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/dropdown-menu';
import { Badge } from '@/core/components/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';
import { cn } from '@/core/lib/utils';

import type { Task } from '../../types';
import { useTaskMutations } from '../../hooks/useTaskMutations';
import { TaskForm } from '../TaskForm';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { changeStatus, deleteTask } = useTaskMutations();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const priorityColors = {
    Baixa: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Média: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const statusIcons = {
    Pendente: <Circle className="size-4 text-muted-foreground" />,
    'Em Andamento': <AlertCircle className="size-4 text-blue-500" />,
    Concluída: <CheckCircle2 className="size-4 text-green-500" />,
  };

  const handleStatusChange = () => {
    if (task.status === 'Concluída') {
      changeStatus.mutate({ id: task.task_id, status: 'Pendente' });
    } else {
      changeStatus.mutate({ id: task.task_id, status: 'Concluída' });
    }
  };

  return (
    <>
      <Card
        className={cn(
          'transition-all hover:shadow-md',
          task.status === 'Concluída' && 'opacity-70'
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1">
            <CardTitle
              className={cn(
                'text-base font-semibold',
                task.status === 'Concluída' && 'text-muted-foreground line-through'
              )}
            >
              {task.title}
            </CardTitle>
            <Badge
              variant="secondary"
              className={cn('w-fit text-xs font-normal', priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <MoreVertical className="size-4" />
                <span className="sr-only">Opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>Editar</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 min-h-[2.5rem] text-sm">
            {task.description || 'Sem descrição'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="size-3.5" />
            {format(new Date(task.due_date), "dd 'de' MMM", { locale: ptBR })}
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleStatusChange}>
            {statusIcons[task.status]}
            <span className="text-xs">{task.status}</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTask.mutate(task.task_id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
