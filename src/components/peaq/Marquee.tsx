export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y bg-primary py-4 text-primary-foreground" aria-hidden>
      <div className="flex w-max animate-marquee gap-10">
        {row.map((w, i) => (
          <span key={i} className="display flex items-center gap-10 text-3xl md:text-5xl">{w}<span className="text-xl">◆</span></span>
        ))}
      </div>
    </div>
  );
}
