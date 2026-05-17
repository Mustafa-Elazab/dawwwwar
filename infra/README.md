# Dawwar Infrastructure & Deployment

This folder contains the configuration for deploying the Dawwar platform as a Lean Monolith using Docker Compose.

## 🚀 Deployment Steps

1.  **Prepare VPS**:
    *   OS: Ubuntu 22.04 or 24.04
    *   Install Docker and Docker Compose.
2.  **Clone Repository**:
    ```bash
    git clone https://github.com/your-repo/dawwar.git ~/dawwar
    cd ~/dawwar
    ```
3.  **Environment Variables**:
    *   Create a `.env.production` file in the root directory based on the variables required in `docker-compose.prod.yml`.
4.  **Launch**:
    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```

## 🛠️ Services

*   **Nginx**: Reverse proxy, SSL termination, and static asset caching.
*   **API**: NestJS backend service.
*   **Worker**: Dedicated BullMQ worker for async background jobs.
*   **Postgres**: Database with PostGIS extensions.
*   **Redis**: High-performance cache and Pub/Sub for WebSockets/BullMQ.

## 💾 Backups

Automatic daily backups are configured via the script in `infra/scripts/backup-db.sh`.
Ensure you configure your R2/S3 bucket credentials if you enable automated remote storage.

## 📊 Monitoring

*   **Health Check**: Accessible at `http://<your-vps-ip>/api/v1/health`
*   **Logs**: View logs using `docker compose logs -f api` or `docker compose logs -f worker`.
