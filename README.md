# Our Voice, Our Rights

A production-ready, accessible, low-literacy-friendly web application that visualizes monthly MGNREGA district performance data for Indian states, starting with Uttar Pradesh.

## Features

- **District Performance Dashboard**: Visualize key MGNREGA metrics with charts and comparisons
- **Low-Literacy UX**: Big icons, minimal text, audio explanations in Hindi/English, color-coded indicators
- **Offline Support**: Cached data when API is unavailable
- **Auto-Geolocation**: Detects user's district via browser geolocation and reverse geocoding
- **Progressive Enhancement**: Works on low-bandwidth connections
- **Accessibility**: WCAG compliant components and keyboard navigation

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (80)    │    │   Frontend      │    │   Backend       │
│   Reverse Proxy │◄──►│   React +       │◄──►│   Express +     │
│                 │    │   Vite (3000)   │    │   Node.js (5000)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   MongoDB       │    │   Redis         │
                    │   (Data Cache)  │    │   (Optional)    │
                    └─────────────────┘    └─────────────────┘
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Web Speech API
- **Backend**: Node.js, Express.js, MongoDB, Redis (optional)
- **Infrastructure**: Docker, Docker Compose, Nginx
- **APIs**: MGNREGA data.gov.in API, OpenStreetMap Nominatim

## Quick Start

### Local Development

1. **Prerequisites**
   - Node.js 18+
   - MongoDB (local or cloud)
   - Redis (optional, for caching)

2. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd our-voice-our-rights
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. **Seed Sample Data**
   ```bash
   cd ../backend
   npm run seed
   ```

### Production Deployment

See deployment section below.

## API Endpoints

- `GET /api/health` - Health check with last data fetch time
- `GET /api/districts` - List all districts
- `GET /api/districts/:id` - District performance data
- `POST /api/geo/reverse` - Reverse geocode coordinates to district

## Data Ingestion

The application automatically fetches MGNREGA data every 6 hours. To manually trigger:

```bash
# In backend directory
npm run ingest

# Or via Docker
docker-compose exec backend node scripts/ingestData.js
```

## Caching Strategy

- **API Responses**: Cached in MongoDB for 1 hour (configurable)
- **Geocode Results**: Cached for 24 hours to respect Nominatim rate limits
- **Stale-While-Revalidate**: Serves cached data when API is down
- **Redis**: Optional for short-term caching of frequently accessed data

## Accessibility & Low-Literacy UX

- **Visual Design**: Large buttons, high contrast colors, icon-based navigation
- **Audio Support**: Web Speech API for Hindi/English explanations
- **Progressive Disclosure**: Show essential info first, details on demand
- **Color Coding**: Green for positive, red for negative changes
- **Simple Language**: One-line summaries and actionable questions

## Configuration

Environment variables in `.env`:

```env
# Required
DATA_GOV_API_KEY=your_api_key
MONGO_URI=mongodb://localhost:27017/mgnrega

# Optional
STATE=Uttar Pradesh
CACHE_TTL=3600
REDIS_URL=redis://localhost:6379
```

## Testing

```bash
# Backend unit tests
cd backend && npm test

# End-to-end test
cd tests && npm test
```

## Deployment on Ubuntu 22.04 VM

1. **Automated Deployment**
   ```bash
   # Run the deployment script
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Manual Deployment**
   ```bash
   # Install Docker & Docker Compose
   sudo apt update
   sudo apt install -y docker.io docker-compose

   # Clone repo and setup
   git clone <repo-url>
   cd our-voice-our-rights
   cp .env.example .env
   # Edit .env with your settings

   # Start services
   sudo docker-compose up -d --build
   ```

3. **Systemd Service (Optional)**
   Create `/etc/systemd/system/mgnrega-app.service`:
   ```ini
   [Unit]
   Description=MGNREGA App
   After=docker.service
   Requires=docker.service

   [Service]
   Type=oneshot
   RemainAfterExit=yes
   WorkingDirectory=/path/to/your/app
   ExecStart=/usr/bin/docker-compose up -d
   ExecStop=/usr/bin/docker-compose down

   [Install]
   WantedBy=multi-user.target
   ```

   Enable: `sudo systemctl enable mgnrega-app`

## Scaling Considerations

- **Horizontal Scaling**: Stateless backend, shared MongoDB/Redis
- **Load Balancing**: Add multiple backend instances behind Nginx
- **Database**: Use MongoDB Atlas for multi-region replication
- **Caching**: Redis cluster for distributed caching
- **CDN**: CloudFront/S3 for static assets

## Operational Issues & Mitigations

- **API Rate Limits**: data.gov.in (1000 req/day), Nominatim (1 req/sec)
  - Mitigation: Aggressive caching, exponential backoff, circuit breaker
- **Data Freshness**: API updates monthly
  - Mitigation: Cron job every 6 hours, cache invalidation
- **Geolocation Accuracy**: Browser API varies by device
  - Mitigation: Fallback to manual selection, server-side validation
- **Network Issues**: Rural areas have poor connectivity
  - Mitigation: Progressive enhancement, offline-first design

## Architecture Summary (200-300 words)

Our Voice, Our Rights is a full-stack web application designed to make MGNREGA performance data accessible to rural citizens in Uttar Pradesh. The architecture follows a microservices pattern with clear separation of concerns.

**Frontend**: Built with React and Vite for fast development and optimal production builds. Tailwind CSS provides utility-first styling with custom accessibility-focused components. Recharts handles data visualization with simple, understandable charts. The Web Speech API enables audio explanations in Hindi and English, crucial for low-literacy users.

**Backend**: Node.js with Express provides RESTful APIs for data access. MongoDB stores cached MGNREGA data with automatic ingestion every 6 hours. Redis (optional) provides short-term caching for improved performance. Circuit breaker pattern and exponential backoff handle API failures gracefully.

**Infrastructure**: Docker containers ensure consistent deployment across environments. Nginx serves as a reverse proxy with rate limiting and security headers. The application is designed for horizontal scaling with stateless backend services.

**Data Flow**: External MGNREGA data is fetched from data.gov.in, normalized, and cached. Geolocation uses OpenStreetMap Nominatim with aggressive caching to respect rate limits. All data is served with appropriate caching headers for offline functionality.

**Accessibility**: Large touch targets, high contrast colors, keyboard navigation, and screen reader support ensure the application works for users with disabilities. Audio explanations and simple language make complex data understandable.

**Scalability**: The architecture supports multiple instances behind a load balancer, with shared MongoDB and Redis clusters. CDN integration for static assets and database read replicas can handle increased traffic.

## UX Rationale for Low-Literacy Users (200-300 words)

The user experience is specifically designed for rural Indian users who may have limited literacy or digital experience. Research shows that visual and auditory learning are more effective than text-heavy interfaces in such contexts.

**Visual Design**: Large, colorful icons replace complex text. Green arrows indicate positive changes, red arrows show negative trends. Simple metaphors like upward arrows for improvement are universally understood. Cards with big numbers and clear visual hierarchy reduce cognitive load.

**Progressive Disclosure**: Essential information appears first. Users can drill down for details rather than being overwhelmed by data. The district selector uses both grid and list views, allowing users to choose their preferred interaction method.

**Audio Support**: Web Speech API provides spoken explanations in Hindi and English. Users can click "Explain" buttons to hear what metrics mean and what questions to ask officials. This is particularly valuable for users who can understand spoken language better than written text.

**Geolocation Integration**: Automatic district detection reduces the need for users to know their district name. If geolocation fails, clear instructions guide manual selection.

**Offline Capability**: Rural areas often have poor connectivity. The app shows cached data with clear indicators when live data isn't available, ensuring functionality even offline.

**Cultural Adaptation**: Hindi translations use simple, conversational language. Color choices avoid culturally sensitive combinations. The interface respects local conventions while maintaining modern usability standards.

**Error Handling**: Friendly error messages with actionable suggestions. No technical jargon - users get clear guidance on what went wrong and how to proceed.

**Mobile-First**: Most users access the internet via mobile devices. Touch-friendly targets and responsive design ensure usability on small screens with varying quality.

This approach ensures that citizens can independently access government data without needing intermediaries, promoting transparency and accountability in MGNREGA implementation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
