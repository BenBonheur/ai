import { redirect } from "next/navigation"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardOverview />
}
