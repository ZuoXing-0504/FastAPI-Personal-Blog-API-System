type StatChipProps = {
  value: string;
  label: string;
};

export function StatChip({ value, label }: StatChipProps) {
  return (
    <div className="rounded-card border-line bg-surface border px-4 py-4">
      <div className="editorial-title text-lg text-black">{value}</div>
      <div className="mt-1 text-sm leading-6 text-black/65">{label}</div>
    </div>
  );
}
