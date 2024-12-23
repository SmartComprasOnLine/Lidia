const express = require('express');
const router = express.Router();
const logger = require('./logger'); // Import the logger
const { redisClient } = require('./db'); // Import the Redis client
const fetch = require('node-fetch'); // Import node-fetch for making HTTP requests
const db = require('./db'); // Import the database connection

// Endpoint to receive messages from WhatsApp
router.post('/webhook', (req, res) => {
    const { body } = req;

    logger.info('Received message', body); // Log the received message

    // Process the message and respond accordingly
    if (body && body.messages && body.messages.length > 0) {
        const message = body.messages[0];
        const command = message.body;

        switch (command) {
            case '/criar lembrete':
                logger.info('Creating reminder');
                res.send('Lembrete criado!');
                break;
            case '/sugestões de rotina':
                logger.info('Providing routine suggestions');
                res.send('Aqui estão algumas sugestões de rotina...');
                break;
            case '/status de tarefas':
                logger.info('Checking task status');
                res.send('Aqui está o status das suas tarefas...');
                break;
            default:
                res.send('Comando não reconhecido.');
        }
    } else {
        res.status(400).send('Bad Request');
    }
});

// Endpoint to test database connection
router.get('/test-db-connection', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()'); // Test query to check connection
        logger.info('Database connection successful'); // Log successful connection
        res.json({ message: 'Database connection successful', time: result.rows[0] });
    } catch (err) {
        logger.error('Error connecting to database', err); // Log the error
        res.status(500).send('Database connection error');
    }
});

// Endpoint to send messages
router.post('/send', async (req, res) => {
    const { number, text, instance, apikey } = req.body;

    const options = {
        method: 'POST',
        headers: {
            apikey: apikey, // API key must be provided in the request body
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            text: text,
            delay: 123,
            quoted: {
                key: {
                    remoteJid: "<string>",
                    fromMe: true,
                    id: "<string>",
                    participant: "<string>"
                },
                message: {
                    conversation: "<string>"
                }
            },
            linkPreview: true,
            mentionsEveryOne: true,
            mentioned: ["<string>"]
        })
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendText/${instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Message send response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending message', err);
        res.status(500).send('Error sending message');
    }
});

// New endpoints added below

router.post('/instance/create', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch('http://localhost:8080/instance/create', options);
        const jsonResponse = await response.json();
        console.log('Create instance response:', jsonResponse); // Log the response to the console
        console.log('Create instance response:', jsonResponse); // Log the response to the console
        logger.info('Create instance response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error creating instance', err);
        res.status(500).send('Error creating instance');
    }
});

router.get('/instance/fetchInstances', async (req, res) => {
    const options = { method: 'GET', headers: { apikey: 'lidiakey' } }; // Include the API key

    try {
        const response = await fetch('http://localhost:8080/instance/fetchInstances', options);
        const jsonResponse = await response.json();
        logger.info('Fetch instances response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error fetching instances', err);
        res.status(500).send('Error fetching instances');
    }
});

router.get('/instance/connect/:instance', async (req, res) => {
    const options = { method: 'GET', headers: { apikey: 'lidiakey' } }; // Include the API key

    try {
        const response = await fetch(`http://localhost:8080/instance/connect/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Connect instance response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error connecting instance', err);
        res.status(500).send('Error connecting instance');
    }
});

router.delete('/instance/logout/:instance', async (req, res) => {
    const options = { method: 'DELETE', headers: { apikey: 'lidiakey' } }; // Include the API key

    try {
        const response = await fetch(`http://localhost:8080/instance/logout/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Logout instance response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error logging out instance', err);
        res.status(500).send('Error logging out instance');
    }
});

router.delete('/instance/delete/:instance', async (req, res) => {
    const options = { method: 'DELETE', headers: { apikey: 'lidiakey' } }; // Include the API key

    try {
        const response = await fetch(`http://localhost:8080/instance/delete/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Delete instance response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error deleting instance', err);
        res.status(500).send('Error deleting instance');
    }
});

router.post('/webhook/set/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/webhook/set/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Set webhook response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error setting webhook', err);
        res.status(500).send('Error setting webhook');
    }
});

router.get('/webhook/find/:instance', async (req, res) => {
    const options = { method: 'GET', headers: { apikey: 'lidiakey' } }; // Include the API key

    try {
        const response = await fetch(`http://localhost:8080/webhook/find/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Find webhook response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error finding webhook', err);
        res.status(500).send('Error finding webhook');
    }
});

router.post('/message/sendText/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendText/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Send text message response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending text message', err);
        res.status(500).send('Error sending text message');
    }
});

router.post('/message/sendMedia/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendMedia/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Send media message response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending media message', err);
        res.status(500).send('Error sending media message');
    }
});

router.post('/message/sendWhatsAppAudio/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendWhatsAppAudio/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Send audio message response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending audio message', err);
        res.status(500).send('Error sending audio message');
    }
});

router.post('/message/sendLocation/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendLocation/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Send location response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending location', err);
        res.status(500).send('Error sending location');
    }
});

router.post('/message/sendReaction/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendReaction/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Send reaction response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending reaction', err);
        res.status(500).send('Error sending reaction');
    }
});

router.post('/message/sendList/:instance', async (req, res) => {
    const options = {
        method: 'POST',
        headers: { apikey: 'lidiakey', 'Content-Type': 'application/json' }, // Include the API key
        body: JSON.stringify(req.body)
    };

    try {
        const response = await fetch(`http://localhost:8080/message/sendList/${req.params.instance}`, options);
        const jsonResponse = await response.json();
        logger.info('Send list message response', jsonResponse);
        res.json(jsonResponse);
    } catch (err) {
        logger.error('Error sending list message', err);
        res.status(500).send('Error sending list message');
    }
});

// Export the router
module.exports = router; // Export the router
