import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import TeacherDashboard from "./TeacherDashboard";

export default async function TeacherPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");
  return <TeacherDashboard username={user.username} />;
}
