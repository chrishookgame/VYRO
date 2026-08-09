export const dynamic = "force-dynamic";

import AiCore from "@/components/dashboard/AiCore";
import HeroWelcome from "@/components/dashboard/HeroWelcome";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import {
  Badge,
  Card,
  StatCard,
} from "@/components/ui";

import {
  getDashboardMetrics,
  getDashboardRecentActivity,
} from "@/lib/dashboard";



export default async function Dashboard() {
  const [
    metrics,
    recentActivity,
  ] = await Promise.all([
    getDashboardMetrics(),
    getDashboardRecentActivity(),
  ]);

  return (
    <main className="flex h-screen overflow-hidden bg-[#05070A]">
      <Sidebar />

      <section className="flex min-w-0 flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <HeroWelcome />

            <AiCore />

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Videos"
                value={metrics.videos}
                icon="🎬"
                description="Contenido publicado"
              />

              <StatCard
                title="Visualizaciones"
                value={formatMetric(
                  metrics.views,
                )}
                icon="👁️"
                description="Visualizaciones acumuladas"
              />

              <StatCard
                title="Seguidores"
                value={formatMetric(
                  metrics.followers,
                )}
                icon="👥"
                description="Comunidad total"
              />

              <StatCard
                title="AI Score"
                value={metrics.aiScore}
                icon="🤖"
                description={getAiScoreLabel(
                  metrics.aiScore,
                )}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        Actividad reciente
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        Últimos movimientos de tu cuenta
                      </p>
                    </div>

                    <Badge variant="info">
                      En vivo
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body>
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <article
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <h3 className="font-semibold text-white">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {item.detail}
                          </p>
                        </div>

                        <Badge variant="success">
                          {item.status}
                        </Badge>
                      </article>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h2 className="text-xl font-bold">
                    Estado de VYRO
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Resumen operativo
                  </p>
                </Card.Header>

                <Card.Body>
                  <div className="space-y-4">
                    <StatusRow
                      label="Cuenta"
                      value="Activa"
                    />

                    <StatusRow
                      label="Identidad"
                      value="Verificada"
                    />

                    <StatusRow
                      label="Wallet"
                      value="Operativa"
                    />

                    <StatusRow
                      label="Soporte"
                      value="Disponible"
                    />
                  </div>
                </Card.Body>
              </Card>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatMetric(
  value: number,
): string {
  return new Intl.NumberFormat(
    "es",
    {
      notation: "compact",
      maximumFractionDigits: 1,
    },
  ).format(value);
}

function getAiScoreLabel(
  score: number,
): string {
  if (score >= 90) {
    return "Nivel excelente";
  }

  if (score >= 70) {
    return "Nivel avanzado";
  }

  if (score >= 40) {
    return "Nivel intermedio";
  }

  return "Sin actividad suficiente";
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-950/60 p-4">
      <span className="text-slate-400">
        {label}
      </span>

      <Badge variant="success">
        {value}
      </Badge>
    </div>
  );
}
