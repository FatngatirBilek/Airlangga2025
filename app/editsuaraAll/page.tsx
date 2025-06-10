import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EditAllSuara from "@/components/EditAllSuara"; // adjust path if needed

export default async function Page() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return <EditAllSuara />;
}
