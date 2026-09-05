/** The masthead every inner page opens with. */
export default function PageHead({ title, subtitle, children }) {
  return (
    <div className="border-b border-surface-line bg-white">
      <div className="shell py-6 lg:py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 lg:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-[15px] text-ink-500 lg:text-lg">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
