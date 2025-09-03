"use client";
import useSWR from "swr"; // Default import!

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardEnabled() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard", fetcher, {
    refreshInterval: 5000, // auto-refresh every 5 seconds
  });

  const enabled = data?.enabled ?? false;

  const setEnabled = async (v: boolean) => {
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: v }),
    });
    mutate();
  };

  return {
    enabled,
    setEnabled,
    loading: isLoading,
    error,
  };
}
