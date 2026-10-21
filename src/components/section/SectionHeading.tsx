type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeading({ title, href, linkLabel = "More" }: Props) {
  return (
    <div className="mb-3 flex items-end justify-between border-b border-lbd-border pb-2">
      <h2 className="text-sm font-bold uppercase tracking-widest text-lbd-muted">{title}</h2>
      {href && (
        <a href={href} className="text-xs font-bold uppercase tracking-wide text-lbd-green hover:text-white">
          {linkLabel} →
        </a>
      )}
    </div>
  );
}
