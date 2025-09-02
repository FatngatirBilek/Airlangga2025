import Image from "next/image";
import background from "@/public/images/portalbg.png";
import ChartPortal from "@/components/ChartPortal";
export default function Portal() {
  return (
    <div className="relative min-h-screen">
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
      <ChartPortal />
    </div>
  );
}
