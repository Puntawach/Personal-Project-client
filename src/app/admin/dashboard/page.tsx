import AncButton from "@/components/custom/AncButton";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";

export default async function DashboardPage() {
  const session = await auth();
  console.log("session", session);
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AncButton>Test AncButton</AncButton>
      <Button>Test Button</Button>
    </div>
  );
}
