"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";

type ListResponse<T> = { data: T[] };

/**
 * List + create/update/patch/delete for one REST resource, with toasts and cache refresh.
 * `noun` is used in messages, e.g. "Announcement saved".
 */
export function useCrud<T extends { id: string }>(endpoint: string, noun: string, options: { queryKey?: readonly unknown[]; invalidate?: readonly unknown[][] } = {}) {
  const client = useQueryClient();
  const queryKey = options.queryKey ?? [endpoint];
  const refresh = () => {
    client.invalidateQueries({ queryKey });
    options.invalidate?.forEach((key) => client.invalidateQueries({ queryKey: key }));
  };
  const fail = (error: unknown) => toast.error(errorMessage(error, `Couldn't save the ${noun.toLowerCase()}.`));

  const list = useQuery({ queryKey, queryFn: () => api<ListResponse<T>>(endpoint) });

  const create = useMutation({
    mutationFn: (payload: object) => api<{ data: T }>(endpoint, { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => { toast.success(`${noun} created`); refresh(); },
    onError: fail,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: object }) => api<{ data: T }>(`${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => { toast.success(`${noun} updated`); refresh(); },
    onError: fail,
  });

  /** Quiet partial update for toggles (publish, feature, status). */
  const patch = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: object }) => api<{ data: T }>(`${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: refresh,
    onError: (error) => toast.error(errorMessage(error, "Couldn't update.")),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`${endpoint}/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success(`${noun} deleted`); refresh(); },
    onError: (error) => toast.error(errorMessage(error, `Couldn't delete the ${noun.toLowerCase()}.`)),
  });

  return { list, rows: list.data?.data ?? [], create, update, patch, remove, saving: create.isPending || update.isPending };
}

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
