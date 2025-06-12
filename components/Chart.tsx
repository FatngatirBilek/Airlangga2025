"use client";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  ChartData,
  ChartOptions,
  LegendItem,
} from "chart.js";

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

interface SuaraData {
  _id: string;
  nama: string;
  nomor: number;
  count: number;
}

function generateColor(index: number, total: number): string {
  const hue = Math.round((index * (360 / total)) % 360);
  const saturation = 90;
  const lightness = 50;
  return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
}

function generateBorderColor(color: string): string {
  return color.replace("5", "1").replace("60%", "50%");
}

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        generateLabels: (chart): LegendItem[] => {
          const data = chart.data;
          if (data.labels && data.datasets.length) {
            const dataset = data.datasets[0];

            const backgroundColors = Array.isArray(dataset.backgroundColor)
              ? (dataset.backgroundColor as string[])
              : [];
            const borderColors = Array.isArray(dataset.borderColor)
              ? (dataset.borderColor as string[])
              : [];

            return (data.labels as string[]).map((label, index) => {
              const text = typeof label === "string" ? label : String(label);
              const fillStyle =
                backgroundColors[index % backgroundColors.length] ||
                "rgba(0,0,0,0.1)";
              const strokeStyle =
                borderColors[index % borderColors.length] || "rgba(0,0,0,0.1)";
              return {
                text: text,
                fillStyle: fillStyle,
                strokeStyle: strokeStyle,
                lineWidth: 1,
                hidden: !chart.isDatasetVisible(0),
                index: index,
                datasetIndex: 0,
              };
            });
          }
          return [];
        },
      },
    },
    title: {
      display: true,
      text: "Hasil Perhitungan Suara",
      font: { size: 18 },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: "Jumlah Suara" },
    },
    x: {
      title: { display: true, text: "Kandidat" },
    },
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChartView() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR<SuaraData[]>("/api/suara", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Build chartData from apiData
  const chartData: ChartData<"bar"> = {
    labels: apiData ? apiData.map((item) => item.nama) : [],
    datasets: [
      {
        label: "Jumlah Suara",
        data: apiData ? apiData.map((item) => item.count) : [],
        backgroundColor: apiData
          ? apiData.map((_, index) => generateColor(index, apiData.length))
          : [],
        borderColor: apiData
          ? apiData.map((_, index) =>
              generateBorderColor(generateColor(index, apiData.length)),
            )
          : [],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current && apiData && !isLoading && !error) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: options,
        });
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [JSON.stringify(chartData), isLoading, error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Perhitungan Suara</h1>
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
        {isLoading && <div>Loading Chart Data...</div>}
        {error && <div>Error loading data: {String(error)}</div>}
        {!isLoading && !error && (
          <div style={{ position: "relative", height: "450px", width: "100%" }}>
            <canvas ref={chartRef} id="mySuaraChart"></canvas>
          </div>
        )}
      </div>
    </div>
  );
}
