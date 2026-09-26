import Sidebar from "./_components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen font-sans flex text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
