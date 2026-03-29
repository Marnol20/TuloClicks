const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Path logic: './routes/events' means "look in the routes folder for events.js"
const eventRoutes = require('./routes/events'); 
const speakerRoutes = require('./routes/speakers');
const venueRoutes = require('./routes/venues');

app.use('/api/events', eventRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/venues', venueRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});