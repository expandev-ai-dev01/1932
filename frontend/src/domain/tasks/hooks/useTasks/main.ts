import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { TaskFilters } from '../../types';

export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.list(filters),
  });
};
