/** Turns a lead/leads or close/closes field into an array either way. */
const lines = (...maybe) => maybe.flatMap((v) => (Array.isArray(v) ? v : v ? [v] : []));

/** A bulleted list, in the documents' own dot-and-indent style. */
function Points({ items }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 pl-1 text-[15px] leading-relaxed text-ink-700">
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
  /**
   * A numbered document reads straight down and its headings carry their own
   * ordering, so it gets plain black headings and no contents rail — the list
   * would just repeat the numbers already on the page.
   */
  const numbered = Boolean(doc.numbered);
  const heading = numbered
    ? 'text-xl font-bold text-ink-900 lg:text-2xl'
    : 'text-xl font-bold text-brand-700 underline underline-offset-4 lg:text-2xl';

  return (
    <div className="shell py-6 lg:grid lg:grid-cols-12 lg:gap-10">
      {/*
        Fourteen sections is a lot to scroll past looking for the one clause
        you came for, so a desktop gets a contents list pinned beside the
        document rather than a column of text and two empty margins.

        Plain anchors, so this stays a server component and needs no script.
      */}
      <nav
        aria-label="On this page"
        className={`hidden lg:sticky lg:top-24 lg:col-span-3 ${numbered ? '' : 'lg:block'}`}
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">
          On this page
        </p>

        <ol className="mt-3 space-y-1 border-l border-surface-line">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[14px] leading-snug text-ink-600 transition hover:border-action-500 hover:text-action-500"
              >
                {section.title}
              </a>
            </li>
          ))}
          {doc.contact && (
          <li>
            <a
              href="#contact-us"
              className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[14px] leading-snug text-ink-600 transition hover:border-action-500 hover:text-action-500"
            >
              {doc.contact.title}
            </a>
          </li>
          )}
        </ol>
      </nav>

      <article className={numbered ? 'lg:col-span-12' : 'lg:col-span-9'}>
      <h1 className="text-2xl font-bold uppercase leading-snug tracking-tight text-brand-700 lg:text-3xl">
        {doc.title}
      </h1>

      {doc.intro.length > 0 && (
      <div className="mt-6 space-y-5 border-b border-surface-line pb-8">
        {doc.intro.map((para) => (
          <p key={para} className="text-[15px] leading-relaxed text-ink-700">
            {para}
          </p>
        ))}
      </div>
      )}

      {doc.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-20 pt-10">
          <h2 className={heading}>
            {section.title}
          </h2>

          {section.lead && (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">{section.lead}</p>
          )}

          {section.blocks.map((block, i) => (
            <div key={block.subtitle || i} className="mt-5">
              {block.subtitle && (
                <h3 className="text-[15px] font-bold text-ink-900">{block.subtitle}</h3>
              )}

              {lines(block.lead, block.leads).map((line) => (
                <p key={line} className="mt-2 text-[15px] leading-relaxed text-ink-700">
                  {line}
                </p>
              ))}

              {block.items && <Points items={block.items} />}

              {lines(block.close, block.closes).map((line) => (
                <p key={line} className="mt-2 text-[15px] leading-relaxed text-ink-700">
                  {line}
                </p>
              ))}

              {block.after && <Points items={block.after} />}
            </div>
          ))}
        </section>
      ))}

      {/* -- How to reach a person about any of it ------------------- */}
      {doc.contact && (
      <section id="contact-us" className="scroll-mt-20 pt-10">
        <h2 className={heading}>
          {doc.contact.title}
        </h2>

        <p className="mt-4 text-[15px] leading-relaxed text-ink-700">{doc.contact.lead}</p>

        <p className="mt-2 text-[15px] font-bold text-ink-900">
          Email:{' '}
          <a href={`mailto:${doc.contact.email}`} className="text-action-500 underline">
            {doc.contact.email}
          </a>
        </p>
        <p className="text-[15px] font-bold text-ink-900">
          Phone:{' '}
          <a
            href={`tel:${doc.contact.phone.replace(/\s/g, '')}`}
            className="text-action-500 underline"
          >
            {doc.contact.phone}
          </a>
        </p>

        {doc.contact.note && (
          <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{doc.contact.note}</p>
        )}
      </section>
      )}

        {doc.updated && (
          <p className="mt-10 text-[15px] font-bold text-ink-900">Last Updated: {doc.updated}</p>
        )}
      </article>
    </div>
  );
}
