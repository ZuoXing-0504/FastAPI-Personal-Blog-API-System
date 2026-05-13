type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "";

  return (
    <div className={`flex flex-col gap-4 ${alignment}`.trim()}>
      {eyebrow ? <span className="editorial-eyebrow">{eyebrow}</span> : null}
      <div className="space-y-3">
        <h2 className="editorial-title text-4xl text-black sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="editorial-copy max-w-2xl text-lg">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
