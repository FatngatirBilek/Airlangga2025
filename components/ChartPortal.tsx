"use client";
import useSWR from "swr";
import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  TooltipItem,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface SuaraData {
  _id: string;
  nama: string;
  nomor: string; // "" for Golput
  count: string;
}

const chartColors = ["#F76102", "#F7A43A", "#FFDC04", "#FFDE94"];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<"doughnut">): string {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
  cutout: "60%",
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

  // Only paslons (not golput)
  const paslonData = useMemo(
    () =>
      apiData?.filter(
        (d) => d.nomor !== "" && d.nama.toLowerCase() !== "golput",
      ) ?? [],
    [apiData],
  );
  // Only golput
  const golputData = useMemo(
    () => apiData?.find((d) => d.nama.toLowerCase() === "golput"),
    [apiData],
  );

  // Chart data includes golput
  const chartData = useMemo(
    () => ({
      labels: [...paslonData.map((item) => item.nama), "Golput"],
      datasets: [
        {
          label: "Jumlah Suara",
          data: [
            ...paslonData.map((item) => parseInt(item.count, 10)),
            golputData ? parseInt(golputData.count, 10) : 0,
          ],
          backgroundColor: [
            ...paslonData.map(
              (_, idx) => chartColors[idx % chartColors.length],
            ),
            chartColors[3],
          ],
          borderColor: [
            ...paslonData.map(
              (_, idx) => chartColors[idx % chartColors.length],
            ),
            chartColors[3],
          ],
          borderWidth: 4,
        },
      ],
    }),
    [paslonData, golputData],
  );

  useEffect(() => {
    if (chartRef.current && paslonData.length && !isLoading && !error) {
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
  }, [paslonData, golputData, isLoading, error, chartData]);

  // Images (for demo)
  const paslonImages = [
    "/images/paslon1.jpeg",
    "/images/paslon2.jpeg",
    "/images/paslon3.jpeg",
    "/images/paslon1.jpeg", // fallback
  ];
  const portalBg = "/images/portalbg.png";

  // Card and pill sizing
  const cardWidth = 300;
  const cardImageHeight = 230;
  const pillWidth = "60%"; // smaller pill
  const pillPadding = "2px 0px";
  const pillFontSize1 = "0.92rem";
  const pillFontSize2 = "0.87rem";
  const pillRadius = 16;

  // Chart colors for bars
  const paslonNumberBarColors = ["#F76102", "#F7A43A", "#FFDC04", "#F76102"];
  const paslonNameBarColors = ["#F76102", "#F7A43A", "#FFDC04", "#F76102"];
  const suaraTextColors = ["#fff", "#fff", "#9f6c00", "#fff"];
  const getBarColor = (idx: number, arr: string[]) => arr[idx % arr.length];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={portalBg}
          alt="background image"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Logo */}
      <Image
        src="/images/logoportal.svg"
        alt="Logo"
        className="absolute top-8 left-8 h-24 w-auto z-20"
        width={50}
        height={50}
        priority
      />

      {/* Title */}
      <div className="absolute top-20 left-0 w-full flex justify-center z-10">
        <h1
          className="text-4xl font-extrabold uppercase tracking-wide text-white text-center drop-shadow-lg"
          style={{ textShadow: "0 2px 8px #222" }}
        >
          DASHBOARD PERHITUNGAN SUARA
          <br />
          AIRLANGGA 2025
        </h1>
      </div>

      <div className="absolute flex flex-col items-center justify-center z-10 left-[49%] top-[57%] -translate-x-1/2 -translate-y-1/2">
        <div
          style={{
            position: "relative",
            height: "420px",
            width: "420px",
            borderRadius: "50%",
            boxShadow: "0 0 50px 15px #4cff15, 0 0 0 14px #222 inset",
            background: "rgba(48,255,70,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading && (
            <div className="text-white font-bold text-xl">
              Loading Chart Data...
            </div>
          )}
          {error && (
            <div className="text-red-600 font-bold text-xl">
              Error loading data: {String(error)}
            </div>
          )}
          {!isLoading && !error && (
            <canvas
              ref={chartRef}
              id="mySuaraPieChart"
              width={420}
              height={420}
            ></canvas>
          )}
        </div>
      </div>

      {/* Cards container with glass background */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10"
        style={{
          width: cardWidth + 14,
          minHeight: 540,
          height: "auto",
        }}
      >
        {/* Glass background behind all cards */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            borderRadius: 18,
            background: "rgba(255,255,255,0.22)",
            boxShadow: "0 6px 24px 0 rgba(0,0,0,0.22)",
            border: "2px solid rgba(255,255,255,0.34)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            zIndex: 1,
          }}
        ></div>
        <div
          className="relative w-full flex flex-col items-center"
          style={{
            borderRadius: 18,
            background: "transparent",
            boxShadow: "none",
            border: "none",
            padding: "12px 0",
            gap: "12px",
            zIndex: 2,
          }}
        >
          {paslonData.map((c, idx) => (
            <div
              key={c._id}
              className="flex flex-col items-center w-full"
              style={{
                borderRadius: 12,
                background: "transparent",
                boxShadow: "none",
                padding: 0,
                width: cardWidth,
                maxWidth: cardWidth,
                overflow: "visible",
                border: "none",
                position: "relative",
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  width: cardWidth,
                  height: cardImageHeight,
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "0px",
                  boxShadow: "0 2px 7px rgba(0,0,0,0.08)",
                  background: "#eee",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Image
                  src={paslonImages[idx % paslonImages.length]}
                  alt={`Paslon ${c.nomor}`}
                  width={cardWidth}
                  height={cardImageHeight}
                  className="object-cover object-top"
                  style={{
                    objectFit: "cover",
                    width: `${cardWidth}px`,
                    height: `${cardImageHeight}px`,
                    borderRadius: "12px",
                    zIndex: 1,
                  }}
                  priority
                />
                {/* Pills at the very bottom edge, OUTSIDE the image */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "10px", // move pills below image
                    transform: "translateX(-50%)",
                    width: pillWidth,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "7px",
                  }}
                >
                  {/* Number bar */}
                  <div
                    style={{
                      background: getBarColor(idx, paslonNumberBarColors),
                      borderRadius: pillRadius,
                      padding: pillPadding,
                      width: "100%",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: pillFontSize1,
                      textAlign: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    {`Paslon ${c.nomor || "null"}`}
                  </div>
                  {/* Name & suara bar */}
                  <div
                    style={{
                      background: getBarColor(idx, paslonNameBarColors),
                      borderRadius: pillRadius,
                      padding: pillPadding,
                      width: "100%",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: pillFontSize2,
                      textAlign: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {c.nama}
                    {c.count && (
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.83rem",
                          marginTop: "1px",
                          textAlign: "center",
                          color: getBarColor(idx, suaraTextColors),
                          letterSpacing: "0.01em",
                        }}
                      >
                        {`${c.count} suara`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Golput card (smaller pill at the end, no image) */}
          {golputData && (
            <div
              key={golputData._id}
              className="flex flex-col items-center w-full"
              style={{
                borderRadius: 12,
                background: "#F9E8BE",
                width: cardWidth,
                maxWidth: cardWidth,
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
                padding: "9px 0 9px 0",
                marginTop: "40px",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  color: "#594013",
                  fontWeight: 900,
                  fontSize: "1.18rem",
                  textAlign: "center",
                  letterSpacing: "0.07em",
                  fontFamily: "inherit",
                  marginBottom: "2px",
                }}
              >
                GOLPUTT
              </span>
              <span
                style={{
                  color: "#594013",
                  fontWeight: 700,
                  fontSize: "0.93rem",
                  textAlign: "center",
                  marginTop: "1px",
                }}
              >
                {golputData.count ? `${golputData.count} suara` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
