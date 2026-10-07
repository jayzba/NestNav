# 🏙️ NestNav

**Find Where to Live. Without the Stress.**

NestNav is a full-stack web application designed for university students and young professionals. It solves one of the most painful parts of relocating: balancing the cost of rent against the pain of a daily commute. 

Instead of opening 15 tabs of Zillow and Google Maps, NestNav aggregates **real government housing data** alongside **live, real-world traffic profiling** to help you find the perfect neighborhood.

## ✨ Features

- **Government-Backed Housing Data**: Integrates the official HUD (Department of Housing and Urban Development) API to pull accurate, up-to-date Fair Market Rent (FMR) prices for studio, 1BR, 2BR, and 3BR apartments across major metropolitan areas.
- **Smart Traffic Profiling**: Uses the Mapbox Matrix API to calculate live commute times from surrounding suburbs to the city center.
- **Time-of-Day Analysis**: Stop guessing what traffic is like. NestNav keeps a running average of commute times by hour, allowing users to see exactly what their drive will look like during Rush Hour vs. Off-Peak hours.
- **Dynamic Cost Comparison**: Interactive UI allows users to easily compare housing prices across different apartment sizes while visualizing transit infrastructure.

## 🏗️ Architecture & Engineering

NestNav was engineered to be highly scalable and API-efficient.

- **Frontend**: Built with **React** and **Vite** for a lightning-fast, responsive user interface. Styled with modern CSS variables, glassmorphism, and Chart.js for data visualization.
- **Backend / Database**: Powered by **Firebase Firestore**. 
- **Automated Data Collector**: To prevent exhausting expensive third-party API limits, the frontend *does not* talk to Mapbox or HUD directly. Instead, a custom **Node.js collector script** runs automatically on a schedule via **GitHub Actions**.
  - *Traffic Collector*: Runs every 30 minutes, fetching live data from Mapbox and updating the running averages in Firestore.
  - *Housing Collector*: Runs daily to check for updated FMR data from the government.
- The React frontend simply listens to Firestore, resulting in zero API limit worries, instant load times, and a highly scalable architecture.

## 🛠️ Built With
- **React.js** / **Vite**
- **Firebase** (Firestore)
- **Node.js**
- **GitHub Actions** (CI/CD Automation)
- **Mapbox API**
- **HUD User API**
- **Chart.js**