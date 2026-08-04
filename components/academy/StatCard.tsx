type StatCardProps = {
  title: string;
  value: string;
  description?: string;
};

export function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-gray-500">
        {title}
      </h2>

      <p className="mt-3 break-words text-2xl font-bold">
        {value}
      </p>

      {description ? (
        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>
      ) : null}
    </article>
  );
}