"use client";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import Image from "next/image";
import background from "@/public/images/bg.png";
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

const chartColors = [
  "#FFD600", // yellow
  "#FFA726", // orange
  "#FF5722", // deep orange
];
const chartBorders = ["#FFD600", "#FFA726", "#FF5722"];

const paslonImages = [
  "/images/paslon1.jpeg",
  "/images/paslon2.jpeg",
  "/images/paslon3.jpeg",
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
          ? apiData.map((_, idx) => chartColors[idx % chartColors.length])
          : [],
        borderColor: apiData
          ? apiData.map((_, idx) => chartBorders[idx % chartBorders.length])
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
        <div className="flex flex-col justify-center gap-7 w-72 pr-10">
          {apiData &&
            apiData.map((c, idx) => (
              <div key={c._id} className="flex flex-col items-stretch">
                {/* Fix: Use parent div with position: relative and set height, remove fill's style.height */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 140,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={paslonImages[idx] || "/images/paslon1.png"}
                    alt={`Paslon ${c.nomor}`}
                    fill
                    className="object-cover object-top"
                    priority
                    style={{
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                {/* Info Box */}
                <div
                  className="bg-[#87b792] px-2 py-3 rounded-b-xl shadow -mt-2 flex flex-col items-center"
                  style={{ borderRadius: "0 0 18px 18px" }}
                >
                  <span
                    className="font-bold text-[14px] uppercase tracking-wider mb-1"
                    style={{
                      background: "#FF7000",
                      borderRadius: 18,
                      color: "#fff",
                      padding: "5px 18px",
                      width: "fit-content",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: 7,
                      marginTop: 3,
                    }}
                  >
                    Paslon {c.nomor}
                  </span>
                  <span
                    className="font-bold text-[13px] text-center"
                    style={{
                      background: chartColors[idx % chartColors.length],
                      borderRadius: 18,
                      color: "#fff",
                      padding: "5px 18px",
                      width: "fit-content",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {c.nama}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Chart Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-xl font-extrabold uppercase tracking-[0.12em] text-white drop-shadow mb-2 text-center">
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
