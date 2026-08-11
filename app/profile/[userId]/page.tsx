import PublicCreatorProfile from "@/components/profile/PublicCreatorProfile";

type PublicProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-8">
      <PublicCreatorProfile
        userId={userId}
      />
    </main>
  );
}
