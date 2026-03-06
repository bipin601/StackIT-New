export default function TagList({ tags = [], onTagClick, activeTag }) {
  // Normalise: tags can arrive as string[] or object[] like [{ name: "python" }]
  const normalised = tags
    .map(t => (typeof t === "string" ? t : t?.name))
    .filter(Boolean);

  if (!normalised.length) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        .tl {
          display: flex; flex-wrap: wrap; gap: 7px; align-items: center;
          font-family: 'Share Tech Mono', monospace;
        }

        .tl-tag {
          display: inline-flex; align-items: center;
          padding: 4px 11px;
          border: 1px solid rgba(0,255,200,0.2);
          background: rgba(0,255,200,0.04);
          font-size: 11px; letter-spacing: 0.07em;
          color: rgba(0,255,200,0.75);
          transition: border-color 0.18s, background 0.18s, color 0.18s;
          animation: tl-in 0.25s ease both;
          user-select: none;
        }

        @keyframes tl-in {
          from { opacity: 0; transform: scale(0.88) translateY(3px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .tl-tag.clickable { cursor: pointer; }
        .tl-tag.clickable:hover {
          border-color: rgba(0,255,200,0.45);
          background: rgba(0,255,200,0.09);
          color: #00ffc8;
        }

        .tl-tag.active {
          border-color: #00ffc8;
          background: rgba(0,255,200,0.12);
          color: #00ffc8;
          box-shadow: 0 0 10px rgba(0,255,200,0.15);
        }
      `}</style>

      <div className="tl">
        {normalised.map((tag, i) => (
          <span
            key={tag}
            className={[
              "tl-tag",
              onTagClick ? "clickable" : "",
              activeTag === tag ? "active" : "",
            ].join(" ").trim()}
            style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => onTagClick?.(tag)}
            title={onTagClick ? `Filter by ${tag}` : tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}