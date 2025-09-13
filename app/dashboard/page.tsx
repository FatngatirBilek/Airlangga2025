import { auth } from "@/auth";
import DashboardClientPage from "./DashboardClientPage";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user as { role?: string };

  if (!user || user.role !== "admin") {
    redirect("/api/auth/signin");
  }

  return <DashboardClientPage />;
}
