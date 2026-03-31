const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Root route (fix for "Cannot GET /")
app.get('/', (req, res) => {
  res.send('TuloClicks Backend is running');
});

const eventRoutes = require('./routes/events');
const speakerRoutes = require('./routes/speakers');
const venueRoutes = require('./routes/venues');
const attendeeRoutes = require('./routes/attendees');
const authRoutes = require('./routes/auth');

app.use('/api/events', eventRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});