import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MonthlyDashboard } from '@/backend';
import { toast } from 'sonner';

const DASHBOARDS_QUERY_KEY = ['dashboards'];

export function useAllDashboards() {
  const { actor, isFetching } = useActor();

  return useQuery<MonthlyDashboard[]>({
    queryKey: DASHBOARDS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDashboards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveDashboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dashboard }: { id: bigint; dashboard: MonthlyDashboard }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.upsertDashboard(id, dashboard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARDS_QUERY_KEY });
      toast.success('Dashboard saved successfully!');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to save dashboard. Please try again.');
    },
  });
}

export function useDeleteDashboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteDashboard(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARDS_QUERY_KEY });
      toast.success('Dashboard deleted successfully!');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete dashboard. Please try again.');
    },
  });
}
