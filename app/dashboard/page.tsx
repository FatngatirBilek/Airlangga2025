"use client";
import { useDashboardEnabled } from "@/app/context/useDashboardEnabled";
import EditAllSuara from "@/components/EditAllSuara";
import { motion } from "framer-motion";
import Image from "next/image";
import background from "@/public/images/dashboardbg.webp";

export default function DashboardPage() {
  const { enabled, setEnabled, loading } = useDashboardEnabled();

  if (loading) return <div>Loading...</div>;

  const chartToggleButton = (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => setEnabled(!enabled)}
      className={`details-paslon px-5 py-2 rounded-lg font-semibold shadow transition-colors duration-300
        ${
          enabled
            ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
            : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-300"
        }
        text-white focus:outline-none focus:ring-2 focus:ring-offset-2`}
      style={{
        minWidth: "180px",
        letterSpacing: "1px",
      }}
    >
      {enabled ? "Disable Chart Portal" : "Enable Chart Portal"}
    </motion.button>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
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
      {/* Logo */}
      <Image
        src="/images/logoportal.svg"
        alt="Logo"
        className="absolute top-8 left-8 h-24 w-auto z-20"
        width={50}
        height={50}
        priority
      />
      {/* Card/Table */}
      <div className="w-full flex justify-center">
        <EditAllSuara chartToggleButton={chartToggleButton} />
      </div>
    </div>
  );
}
