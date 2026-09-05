/** The skeleton the app router shows while a page is on its way. */
export default function Loading() {
  return (
    <div className="shell py-10">
      <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/70" />
        ))}
      </div>
    </div>
  );
}
