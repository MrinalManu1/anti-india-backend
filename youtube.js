const axios = require("axios");

function extractVideoId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function fetchYouTubeComments(apiKey, videoId, maxResults = 100) {
  let comments = [];
  let pageToken = null;

  while (comments.length < maxResults) {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          key: apiKey,
          part: "snippet",
          videoId,
          maxResults: 100,
          pageToken,
          textFormat: "plainText",
        },
      }
    );

    const items = response.data.items || [];

    for (const item of items) {
      const snippet = item.snippet.topLevelComment.snippet;
      comments.push({
        author: snippet.authorDisplayName,
        text: snippet.textDisplay,
        published_at: snippet.publishedAt,
      });
    }

    pageToken = response.data.nextPageToken;
    if (!pageToken) break;
  }

  return comments.slice(0, maxResults);
}

module.exports = { extractVideoId, fetchYouTubeComments };
