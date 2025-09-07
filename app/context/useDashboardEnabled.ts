"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardEnabled() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard", fetcher, {
    refreshInterval: 5000,
  });

  const enabled = data?.enabled ?? false;
  const winnerMode = data?.winnerMode ?? false;

  const setEnabled = async (v: boolean) => {
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: v }),
    });
    mutate();
  };

  const setWinnerMode = async (v: boolean) => {
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winnerMode: v }),
    });
    mutate();
  };

  return {
    enabled,
    setEnabled,
    winnerMode,
    setWinnerMode,
    loading: isLoading,
    error,
  };
}
