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
  nomor: number | null;
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
        font: { weight: "bold", size: 17 },
      },
      ticks: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
      },
      grid: {
        color: "rgba(255,255,255,0.16)",
        lineWidth: 1.1,
      },
    },
    x: {
      title: {
        display: true,
        text: "Kandidat",
        color: "#fff",
        font: { weight: "bold", size: 17 },
      },
      ticks: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
      },
      grid: {
        display: false,
        color: "rgba(255,255,255,0.16)",
        lineWidth: 1.1,
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

  // Separate candidates and golput
  const paslonData =
    apiData?.filter(
      (c) => c.nomor !== null && c.nama.toLowerCase() !== "golput",
    ) || [];
  const golputData = apiData?.find((c) => c.nama.toLowerCase() === "golput");

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
        borderRadius: 7,
        barPercentage: 1,
        categoryPercentage: 0.62,
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

  const paslonImageHeight = 150;
  const paslonImageRadius = 18;

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
        className="absolute top-6 left-6 h-24 w-auto z-20"
        width={80}
        height={80}
        priority
      />
      <Image
        src="/images/logompk.svg"
        alt="Logo"
        className="absolute top-6 right-6 h-20 w-auto z-20"
        width={80}
        height={80}
        priority
      />

      {/* Glass background and contents */}
      <div
        className="flex flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 z-10"
        style={{
          width: "calc(100vw - 180px)",
          maxWidth: "1080px",
          height: "calc(80vh - 120px)",
          minHeight: "550px",
          alignItems: "center",
        }}
      >
        {/* Candidate List */}
        <div className="flex flex-col justify-center gap-6 w-72 pr-8">
          {/* PASLON cards only */}
          {paslonData.map((c, idx) => (
            <div key={c._id} className="flex flex-col items-stretch">
              <div
                style={{
                  position: "relative",
                  width: "79%",
                  height: `${paslonImageHeight}px`,
                  borderRadius: `${paslonImageRadius}px`,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                  marginBottom: "12px",
                }}
              >
                <Image
                  src={paslonImages[idx] || "/images/paslon1.png"}
                  alt={`Paslon ${c.nomor}`}
                  fill
                  className="object-cover"
                  priority
                  style={{
                    borderRadius: `${paslonImageRadius}px`,
                    objectFit: "cover",
                  }}
                />
                {/* Pills FULL WIDTH at the bottom of the image, but SMALLER */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    zIndex: 2,
                    paddingBottom: "0px",
                  }}
                >
                  <span
                    style={{
                      background: "#FF7000",
                      color: "#fff",
                      padding: "4px 0",
                      fontWeight: 700,
                      fontSize: "0.81rem",
                      width: "100%",
                      textAlign: "center",
                      borderRadius: "0px",
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "0px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    PASLON {c.nomor}
                  </span>
                  <span
                    style={{
                      background: chartColors[idx % chartColors.length],
                      color: "#fff",
                      padding: "4px 0",
                      fontWeight: 700,
                      fontSize: "0.81rem",
                      width: "100%",
                      textAlign: "center",
                      borderBottomLeftRadius: `${paslonImageRadius}px`,
                      borderBottomRightRadius: `${paslonImageRadius}px`,
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "0px",
                      marginTop: "1px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {c.nama}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Golput card WITHOUT image */}
          {golputData && (
            <div
              key={golputData._id}
              className="flex flex-col items-stretch"
              style={{
                borderRadius: `${paslonImageRadius}px`,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                marginTop: "12px",
              }}
            >
              {/* Pills FULL WIDTH at the top */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  zIndex: 2,
                  paddingBottom: "0px",
                }}
              >
                <span
                  style={{
                    background: "#FFD600",
                    color: "#594013",
                    padding: "8px 0 3px 0",
                    fontWeight: 900,
                    fontSize: "1.01rem",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "0px",
                    borderTopLeftRadius: `${paslonImageRadius}px`,
                    borderTopRightRadius: `${paslonImageRadius}px`,
                    letterSpacing: "0.02em",
                  }}
                >
                  Golput
                </span>
                <span
                  style={{
                    background: "#FFF9E0",
                    color: "#594013",
                    padding: "5px 0 8px 0",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    width: "100%",
                    textAlign: "center",
                    borderBottomLeftRadius: `${paslonImageRadius}px`,
                    borderBottomRightRadius: `${paslonImageRadius}px`,
                    borderTopLeftRadius: "0px",
                    borderTopRightRadius: "0px",
                    marginTop: "1px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {golputData.count} suara
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-extrabold uppercase tracking-[0.13em] text-white drop-shadow mb-2 text-center">
            DASHBOARD PERHITUNGAN SUARA
            <br />
            AIRLANGGA 2025
          </h1>
          <div style={{ position: "relative", height: "500px", width: "100%" }}>
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
