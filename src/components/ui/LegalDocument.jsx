/** Turns a lead/leads or close/closes field into an array either way. */
const lines = (...maybe) => maybe.flatMap((v) => (Array.isArray(v) ? v : v ? [v] : []));

/** A bulleted list, in the documents' own dot-and-indent style. */
function Points({ items }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 pl-1 text-[16px] leading-relaxed text-ink-700">
          <span aria-hidden="true" className="text-ink-400">&middot;</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Any of the policy documents.
 *
 * They are all the same shape — a title, an intro, numbered sections built
 * from blocks of subtitle / lead lines / bullets / closing lines, then how to
 * reach someone and when it was last changed. One renderer means the four
 * documents cannot drift apart in styling, and adding a fifth is a content
 * file and a three-line page.
 *
 * Nothing here is interactive, so it stays a server component and ships no
 * JavaScript.
 */
export default function LegalDocument({ doc }) {
  return (
    <article className="shell py-6 lg:mx-auto lg:max-w-2xl">
      <h1 className="text-2xl font-bold uppercase leading-snug tracking-tight text-brand-700 lg:text-3xl">
        {doc.title}
      </h1>

      <div className="mt-6 space-y-5 border-b border-surface-line pb-8">
        {doc.intro.map((para) => (
          <p key={para} className="text-[16px] leading-relaxed text-ink-700">
            {para}
          </p>
        ))}
      </div>

      {doc.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-20 pt-10">
          <h2 className="text-xl font-bold text-brand-700 underline underline-offset-4 lg:text-2xl">
            {section.title}
          </h2>

          {section.lead && (
            <p className="mt-4 text-[16px] leading-relaxed text-ink-700">{section.lead}</p>
          )}

          {section.blocks.map((block, i) => (
            <div key={block.subtitle || i} className="mt-5">
              {block.subtitle && (
                <h3 className="text-[17px] font-bold text-ink-900">{block.subtitle}</h3>
              )}

              {lines(block.lead, block.leads).map((line) => (
                <p key={line} className="mt-2 text-[16px] leading-relaxed text-ink-700">
                  {line}
                </p>
              ))}

              {block.items && <Points items={block.items} />}

              {lines(block.close, block.closes).map((line) => (
                <p key={line} className="mt-2 text-[16px] leading-relaxed text-ink-700">
                  {line}
                </p>
              ))}

              {block.after && <Points items={block.after} />}
            </div>
          ))}
        </section>
      ))}

      {/* -- How to reach a person about any of it ------------------- */}
      <section id="contact-us" className="scroll-mt-20 pt-10">
        <h2 className="text-xl font-bold text-brand-700 underline underline-offset-4 lg:text-2xl">
          {doc.contact.title}
        </h2>

        <p className="mt-4 text-[16px] leading-relaxed text-ink-700">{doc.contact.lead}</p>

        <p className="mt-2 text-[16px] font-bold text-ink-900">
          Email:{' '}
          <a href={`mailto:${doc.contact.email}`} className="text-action-500 underline">
            {doc.contact.email}
          </a>
        </p>
        <p className="text-[16px] font-bold text-ink-900">
          Phone:{' '}
          <a
            href={`tel:${doc.contact.phone.replace(/\s/g, '')}`}
            className="text-action-500 underline"
          >
            {doc.contact.phone}
          </a>
        </p>

        {doc.contact.note && (
          <p className="mt-5 text-[16px] leading-relaxed text-ink-700">{doc.contact.note}</p>
        )}
      </section>

      <p className="mt-10 text-[16px] font-bold text-ink-900">Last Updated: {doc.updated}</p>
    </article>
  );
}
