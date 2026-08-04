import { AcademyDashboardClient } from "@/components/academy/AcademyDashboardClient";
import { getCurrentStudent } from "@/lib/academy";

export default function AcademyDashboardPage() {
  const student = getCurrentStudent();

  return (
    <AcademyDashboardClient
      student={student}
    />
  );
}
