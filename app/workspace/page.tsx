import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import HeroWelcome from "@/components/dashboard/HeroWelcome";
import AiCore from "@/components/dashboard/AiCore";
import GlassCard from "@/components/ui/GlassCard";
import QuickActions from "@/components/dashboard/QuickActions";

export default function WorkspacePage() {
  return (
    <main className="flex h-screen bg-[#05070A] overflow-hidden">
      <Sidebar />

      <section className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">

          <HeroWelcome />
          <QuickActions />

          <div className="mt-8">
            <AiCore />
          </div>

          <div className="grid grid-cols-4 gap-6 mt-8">

            <GlassCard title="VIDEOS" value="12">
              <p className="text-green-400">+2 hoy</p>
            </GlassCard>

            <GlassCard title="VIEWS" value="14K" color="#3B82F6">
              <p className="text-green-400">+18%</p>
            </GlassCard>

            <GlassCard title="FOLLOWERS" value="892" color="#8B5CF6">
              <p className="text-green-400">+34</p>
            </GlassCard>

            <GlassCard title="AI SCORE" value="98" color="#10B981">
              <p className="text-green-400">Excellent</p>
            </GlassCard>

          </div>

        </div>

      </section>

    </main>
  );
}