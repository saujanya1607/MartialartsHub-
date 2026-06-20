const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { optionalAuth } = require('../middleware/auth');

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

// GET /api/videos/search?q=muay+thai&maxResults=12&pageToken=...
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q = 'martial arts techniques', maxResults = 12, pageToken, order = 'relevance', duration } = req.query;

    const params = {
      part: 'snippet',
      q: `${q} martial arts`,
      type: 'video',
      maxResults: Math.min(parseInt(maxResults), 50),
      order,
      relevanceLanguage: 'en',
      safeSearch: 'moderate',
    };

    if (pageToken) params.pageToken = pageToken;
    if (duration) params.videoDuration = duration; // short, medium, long

    const response = await youtube.search.list(params);
    const items = response.data.items || [];

    if (items.length === 0) {
      return res.json({ videos: [], nextPageToken: null, totalResults: 0 });
    }

    // Get video statistics
    const videoIds = items.map(v => v.id.videoId).join(',');
    const statsResponse = await youtube.videos.list({
      part: 'statistics,contentDetails',
      id: videoIds,
    });

    const statsMap = {};
    (statsResponse.data.items || []).forEach(v => {
      statsMap[v.id] = { stats: v.statistics, details: v.contentDetails };
    });

    const videos = items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      viewCount: statsMap[item.id.videoId]?.stats?.viewCount,
      likeCount: statsMap[item.id.videoId]?.stats?.likeCount,
      duration: statsMap[item.id.videoId]?.details?.duration,
    }));

    res.json({
      videos,
      nextPageToken: response.data.nextPageToken,
      totalResults: response.data.pageInfo?.totalResults,
    });
  } catch (err) {
    const apiMessage = err.response?.data?.error?.message || err.message;
    console.error('YouTube API error:', apiMessage);
    res.status(500).json({ error: 'Video service temporarily unavailable.', detail: apiMessage });
  }
});

// GET /api/videos/featured — curated martial arts channels
router.get('/featured', async (req, res) => {
  try {
    const queries = ['muay thai tutorial', 'BJJ techniques', 'karate kata', 'judo throws'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const response = await youtube.search.list({
      part: 'snippet',
      q: randomQuery,
      type: 'video',
      maxResults: 6,
      order: 'viewCount',
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url,
      channel: item.snippet.channelTitle,
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    res.json(videos);
  } catch (err) {
    const apiMessage = err.response?.data?.error?.message || err.message;
    console.error('YouTube API error (featured):', apiMessage);
    res.status(500).json({ error: 'Video service unavailable.', detail: apiMessage });
  }
});

module.exports = router;
