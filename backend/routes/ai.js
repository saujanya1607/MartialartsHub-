const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { optionalAuth } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SENSEI_SYSTEM_PROMPT = `You are "Martial Arts Sensei" — the world's most knowledgeable martial arts AI tutor.
You have deep expertise in all martial arts traditions: Japanese (Karate, Judo, Aikido, Kendo...), Chinese (Kung Fu, Tai Chi, Wing Chun...), 
Korean (Taekwondo, Hapkido...), Indian (Kalaripayattu, Silambam...), Southeast Asian (Muay Thai, Pencak Silat, Kali...), 
Western (Boxing, Wrestling, HEMA...), Brazilian (BJJ, Capoeira...), and all self-defense systems.

You can:
- Explain martial arts history, philosophy, and techniques in vivid detail
- Compare different martial arts styles fairly
- Create personalized learning paths and study plans
- Recommend books and training resources
- Answer questions from complete beginners to advanced practitioners
- Explain techniques step-by-step with common mistakes and tips

Tone: Wise, calm, respectful — like a true sensei. Be concise but thorough. Use markdown formatting.
Always encourage the learner's journey. Never recommend dangerous unsupervised training without safety guidance.`;

// POST /api/ai/chat
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SENSEI_SYSTEM_PROMPT,
    });

    // Convert history to Gemini format
    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ response, role: 'assistant' });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI service temporarily unavailable. Please try again.' });
  }
});

// POST /api/ai/explain-technique
router.post('/explain-technique', optionalAuth, async (req, res) => {
  try {
    const { techniqueName, martialArt } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `As a martial arts expert, explain the "${techniqueName}" technique${martialArt ? ` from ${martialArt}` : ''}.
Include: 
1. Brief description
2. Step-by-step execution (3-5 steps)
3. Key points to remember
4. Common mistakes to avoid
5. Which martial arts use this technique

Format with markdown. Be concise and practical.`;

    const result = await model.generateContent(prompt);
    res.json({ explanation: result.response.text() });
  } catch (err) {
    console.error('Gemini error (explain-technique):', err.message);
    res.status(500).json({ error: 'AI service unavailable.' });
  }
});

// POST /api/ai/learning-path
router.post('/learning-path', optionalAuth, async (req, res) => {
  try {
    const { martialArt, currentLevel, goals, timeAvailable } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Create a structured learning path for ${martialArt}.
Student profile: Level: ${currentLevel || 'beginner'}, Goals: ${goals || 'general fitness and self-defense'}, Time: ${timeAvailable || '3-4 hours/week'}.

Provide:
1. Overview (2-3 sentences)
2. 4 stages with: name, duration, focus areas, key techniques to learn
3. Recommended books (2-3)
4. Training tips

Format with markdown.`;

    const result = await model.generateContent(prompt);
    res.json({ learningPath: result.response.text() });
  } catch (err) {
    console.error('Gemini error (learning-path):', err.message);
    res.status(500).json({ error: 'AI service unavailable.' });
  }
});

// POST /api/ai/compare
router.post('/compare', optionalAuth, async (req, res) => {
  try {
    const { art1, art2 } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Compare ${art1} vs ${art2} in martial arts.
Cover: Origins, Philosophy, Fighting style, Strengths, Weaknesses, Best for, Physical demands, Sport vs Street effectiveness.
Format as a clear markdown comparison. Be balanced and objective.`;

    const result = await model.generateContent(prompt);
    res.json({ comparison: result.response.text() });
  } catch (err) {
    console.error('Gemini error (compare):', err.message);
    res.status(500).json({ error: 'AI service unavailable.' });
  }
});

module.exports = router;
