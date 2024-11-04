const express = require('express');
const Chatbot = require('../controllers/Chatbot');
const router = express.Router();



// Webhook Routes
router.get('/webhooks', Chatbot.verifyWebhook);
router.post('/webhooks', Chatbot.receiveEvent);

// Chatbot
router.post("/api/send-message", Chatbot.sendPoll);

module.exports = router;
