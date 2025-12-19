# Weather Forecast App

## Overview
Full-stack weather app (React frontend + Express backend). Backend calls OpenWeather APIs and returns current weather + 5-day forecast.

## Setup

### 1. Backend
```bash
cd backend
npm install
# create .env from .env.example and set OPENWEATHER_API_KEY
# .env:
# OPENWEATHER_API_KEY=your_key_here
npm run dev
