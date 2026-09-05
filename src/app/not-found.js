import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">That page has moved on</h1>
      <p className="mt-2 max-w-sm text-ink-500">
        Whatever you were after is not here. The trips are still where you left them.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to the start
      </Link>
    </div>
  );
}
