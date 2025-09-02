"use client";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import Image from "next/image";
import background from "@/public/images/portalbg.png";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

// Register for doughnut chart!
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface SuaraData {
  _id: string;
  nama: string;
  nomor: number;
  count: number;
}

// Pastel colors for chart sections
const pastelColors = [
  "#FFD95A", // yellow
  "#41B3F4", // blue
  "#FF7597", // pink
];

// Borders for Pie
const pastelBorders = ["#FFD95A", "#41B3F4", "#FF7597"];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: "#333", font: { weight: "bold", size: 16 } },
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
  cutout: "65%", // Controls the "hole" size
};

export default function ChartPortal() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR<SuaraData[]>("/api/suara", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  // Prepare chart data for doughnut
  const chartData = {
    labels: apiData ? apiData.map((item) => item.nama) : [],
    datasets: [
      {
        label: "Jumlah Suara",
        data: apiData ? apiData.map((item) => item.count) : [],
        backgroundColor: apiData
          ? apiData.map((_, idx) => pastelColors[idx % pastelColors.length])
          : [],
        borderColor: apiData
          ? apiData.map((_, idx) => pastelBorders[idx % pastelBorders.length])
          : [],
        borderWidth: 4,
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
          type: "doughnut",
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
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={background}
          alt="background image"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
      {/* Chart Section */}
      <div className="flex flex-col items-center justify-center w-[700px] h-[700px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 z-10">
        <h1 className="text-3xl font-extrabold uppercase tracking-[0.18em] text-gray-800 drop-shadow mb-2 text-center">
          Dashboard Perhitungan Suara Airlangga 2025
        </h1>
        <div style={{ position: "relative", height: "540px", width: "100%" }}>
          {isLoading && <div>Loading Chart Data...</div>}
          {error && <div>Error loading data: {String(error)}</div>}
          {!isLoading && !error && (
            <canvas ref={chartRef} id="mySuaraPieChart"></canvas>
          )}
        </div>
      </div>
    </div>
  );
}
