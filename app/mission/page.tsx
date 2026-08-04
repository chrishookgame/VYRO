"use client";

import { useState } from "react";

import ActivityFeed from "@/components/mission/ActivityFeed";
import AIRecommendations from "@/components/mission/AIRecommendations";
import AnalyticsOverview from "@/components/mission/AnalyticsOverview";
import LiveStatus from "@/components/mission/LiveStatus";
import MissionHeader from "@/components/mission/MissionHeader";
import ModuleGrid from "@/components/mission/ModuleGrid";
import QuickLaunch from "@/components/mission/QuickLaunch";
import UpcomingEvents from "@/components/mission/UpcomingEvents";
import WelcomePanel from "@/components/mission/WelcomePanel";

import CreateProjectForm from "@/components/projects/CreateProjectForm";
import ProjectList from "@/components/projects/ProjectList";
import ProjectStats from "@/components/projects/ProjectStats";

export default function MissionPage() {
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0);

  function refreshProjects() {
    setProjectsRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <main className="min-h-screen overflow-y-auto bg-[#05070A] text-white">
      <MissionHeader />

      <div className="mx-auto max-w-[1600px] space-y-8 px-6 py-8 md:px-8 xl:px-10">
        <WelcomePanel />

        <QuickLaunch />

        <ModuleGrid />

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <CreateProjectForm onProjectCreated={refreshProjects} />

          <ProjectList
            refreshKey={projectsRefreshKey}
            onProjectsChanged={refreshProjects}
          />
        </section>

        <ProjectStats key={`stats-${projectsRefreshKey}`} />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <LiveStatus />

          <AIRecommendations key={`ai-${projectsRefreshKey}`} />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <ActivityFeed />

          <UpcomingEvents />
        </div>

        <AnalyticsOverview />
      </div>
    </main>
  );
}