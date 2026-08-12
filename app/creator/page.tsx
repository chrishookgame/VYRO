import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import VideoStudio from "@/components/studio/VideoStudio";

export default function CreatorPage() {
  return (
    <main className="flex min-h-screen bg-[#05070A] text-white">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <section className="min-w-0 flex-1">
        <Header />

        <div className="mx-auto max-w-[1600px] p-4 pb-28 sm:p-6 lg:p-8">
          <VideoStudio />
        </div>
      </section>
    </main>
  );
}