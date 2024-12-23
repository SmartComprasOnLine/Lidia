const express = require('express');
const fetch = require('node-fetch'); // Import node-fetch
const app = express();
const db = require('./db'); // Import the database connection
const logger = require('./logger'); // Import the logger
const whatsappRouter = require('./whatsapp'); // Import the WhatsApp router

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Use the WhatsApp router
app.use('/api', whatsappRouter);

// Basic route for testing
app.get('/', (req, res) => {
    logger.info('Root route accessed'); // Log access to the root route
    res.send('Lid.IA Backend is running!');
});

// Endpoint to send data
app.get('/data', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM your_table_name'); // Replace with your actual table name
        logger.info('Data retrieved from database'); // Log successful data retrieval
        res.json(result.rows);
    } catch (err) {
        logger.error('Error retrieving data from database', err); // Log the error
        res.status(500).send('Server error');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error', err); // Log unhandled errors
    res.status(500).send('Internal Server Error');
});

const createInstance = async () => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* Include any necessary data here */ })
    };

    try {
        const response = await fetch('http://localhost:8080/instance/create', options);
        const jsonResponse = await response.json();
        logger.info('Instance created:', jsonResponse); // Log the response
    } catch (err) {
        logger.error('Error creating instance', err); // Log the error
    }
};

// Start the server
app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`); // Log server start
    await createInstance(); // Call the function to create an instance
});
