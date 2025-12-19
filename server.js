require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRouter = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Weather Forecast API running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
