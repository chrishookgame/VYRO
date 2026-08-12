import Feed from "@/components/feed/Feed";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function FeedPage() {
  return (
    <main className="flex min-h-screen bg-[#05070A]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <section className="min-w-0 flex-1">
        <Header />
        <Feed />
      </section>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </main>
  );
}