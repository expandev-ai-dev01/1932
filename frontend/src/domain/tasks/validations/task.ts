import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string('Título é obrigatório')
    .min(3, 'Mínimo de 3 caracteres')
    .max(150, 'Máximo de 150 caracteres'),
  description: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
  due_date: z
    .date('Data de conclusão é obrigatória')
    .refine(
      (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
      'A data não pode ser no passado'
    ),
  priority: z.enum(['Baixa', 'Média', 'Alta'], 'Selecione uma prioridade').default('Média'),
});

export const taskFilterSchema = z.object({
  status: z.array(z.enum(['Pendente', 'Em Andamento', 'Concluída'])).optional(),
  priority: z.array(z.enum(['Baixa', 'Média', 'Alta'])).optional(),
});
