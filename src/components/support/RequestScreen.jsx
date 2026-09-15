/**
 * The frame Flight Search and Train/Bus share: the form on white, and under
 * it on grey the note that online booking is not live yet — which is why the
 * button says Send Request and not Book.
 */
export default function RequestScreen({ title, children }) {
  return (
    <div className="pb-10 lg:pb-16">
      <div className="bg-white">
        <div className="shell py-5 lg:py-10">
          <h1 className="mb-5 hidden text-2xl font-bold text-ink-900 lg:block">{title}</h1>
          {children}
        </div>
      </div>

      <div className="shell pt-6 lg:pt-10">
        <p className="rounded-xl border border-surface-line bg-white px-5 py-6 text-center text-[17px] font-medium text-action-500 lg:max-w-xl">
          Online booking will be live soon
        </p>
      </div>
    </div>
  );
}
