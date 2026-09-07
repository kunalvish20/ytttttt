function getEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname === "youtu.be"
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v");

    if (videoId && (parsed.hostname === "youtu.be" || parsed.hostname.includes("youtube.com"))) {
      const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
      const playlist = parsed.searchParams.get("list");
      const start = parsed.searchParams.get("start") || parsed.searchParams.get("t");
      const si = parsed.searchParams.get("si");

      if (playlist) embedUrl.searchParams.set("list", playlist);
      if (start) embedUrl.searchParams.set("start", start.replace("s", ""));
      if (si) embedUrl.searchParams.set("si", si);

      return embedUrl.toString();
    }
  } catch {
    return url;
  }

  return url;
}

export default function VideoFrame({ url, title, locked = false }: { url?: string; title: string; locked?: boolean }) {
  if (!url) {
    return (
      <div className="videoPlaceholder">
        <div className="playIcon">▶</div>
        <strong>{locked ? "Paid lesson video" : "Course trailer"}</strong>
        <span>{locked ? "Add the lesson URL in .env.local" : "Add NEXT_PUBLIC_HERO_VIDEO_URL in .env.local"}</span>
      </div>
    );
  }

  return (
    <div className="videoRatio">
      <iframe
        src={getEmbedUrl(url)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
