import express from "express";
// import cors from "cors";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";

const app = express();
// app.use(cors());

// --- Extract Video ID Utility ---
function extractVideoID(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", ""); // youtu.be/VIDEOID
    }

    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v"); // youtube.com/watch?v=VIDEOID
    }

    return url; // fallback: direct video ID
  } catch (e) {
    return url;
  }
}

// --- Main API Route ---
app.get("/api/captions", async (req, res) => {
  const { url, lang = "en" } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing YouTube URL" });
  }

  const videoID = extractVideoID(url);

  try {
    const subtitles = await getSubtitles({ videoID, lang });
    const videoDetails = await getVideoDetails({ videoID, lang });

    return res.json({
      success: true,
      videoID,
      subtitles,
      videoDetails
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      videoID,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
