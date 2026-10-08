/**
 * The frame Flight Search and Train/Bus share: the form, on white.
 *
 * The button says Send Request rather than Book, which is the whole of
 * what a visitor needs to know about how this works.
 */
export default function RequestScreen({ title, children }) {
  return (
    <div>
      <div className="bg-white pb-10 lg:pb-16">
        <div className="shell py-5 lg:py-10">
          <h1 className="mb-5 hidden text-2xl font-bold text-ink-900 lg:block">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
