"use client";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import Image from "next/image";
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

const pastelColors = [
  "rgba(255, 233, 122, 1)",
  "rgba(107, 176, 74, 1)",
  "rgba(135, 90, 71,1)",
];

const pastelBorders = [
  "rgba(255, 233, 122, 1)",
  "rgba(107, 176, 74, 1)",
  "rgba(135, 90, 80,1)",
];

const paslonImages = [
  "/images/paslon1.png",
  "/images/paslon2.png",
  "/images/paslon3.png",
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label || ""}: ${context.parsed.y}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Jumlah Suara",
        color: "#fff",
        font: { weight: "bold", size: 20 },
      },
      ticks: {
        color: "#fff",
        font: { weight: "bold" },
      },
      grid: {
        color: "rgba(255,255,255,0.16)",
        lineWidth: 1.5,
      },
    },
    x: {
      title: {
        display: true,
        text: "Kandidat",
        color: "#fff",
        font: { weight: "bold", size: 20 },
      },
      ticks: {
        color: "#fff",
        font: { weight: "bold" },
      },
      grid: {
        display: false,
        color: "rgba(255,255,255,0.16)",
        lineWidth: 1.5,
        drawTicks: false,
      },
    },
  },
};

export default function ChartView() {
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

  const chartData: ChartData<"bar"> = {
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
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
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
    <div className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/images/logosmk.svg"
        alt="Logo"
        className="absolute top-8 left-8 h-24 w-auto z-20"
        width={96}
        height={96}
        priority
      />
      <Image
        src="/images/logompk.svg"
        alt="Logo"
        className="absolute top-8 right-8 h-24 w-auto z-20"
        width={96}
        height={96}
        priority
      />

      <div className="flex flex-row w-[1100px] h-[700px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 z-10">
        {/* Candidate List */}
        <div className="flex flex-col justify-center gap-5 w-48 pr-10">
          {apiData &&
            apiData.map((c, idx) => (
              <div key={c._id} className="flex flex-col items-stretch">
                {/* Stretched horizontally, always showing the top (object-top) */}
                <div
                  className="w-full aspect-[4/3] relative rounded-t-xl overflow-hidden"
                  style={{ minHeight: 0, height: 92 }}
                >
                  <Image
                    src={paslonImages[idx] || "/images/paslon1.png"}
                    alt={`Paslon ${c.nomor}`}
                    fill
                    className="object-cover object-top"
                    sizes="192px"
                    priority
                  />
                </div>
                {/* Info Box */}
                <div className="bg-[#7fbc8b] px-2 py-3 rounded-b-xl shadow -mt-2 flex flex-col items-center">
                  <span className="font-bold text-[15px] uppercase tracking-wider mb-1">
                    PASLON {c.nomor}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 text-center">
                    {c.nama}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Chart Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-[0.18em] text-white drop-shadow mb-2 text-center">
            Dashboard Perhitungan Suara Airlangga 2025
          </h1>
          <div style={{ position: "relative", height: "540px", width: "100%" }}>
            {isLoading && <div>Loading Chart Data...</div>}
            {error && <div>Error loading data: {String(error)}</div>}
            {!isLoading && !error && (
              <canvas ref={chartRef} id="mySuaraChart"></canvas>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
