# 📚 StudyMate

Production-ready web application hosted on Oracle Cloud Infrastructure (OCI) with Nginx reverse proxy and automated GitHub Actions CI/CD deployment.

## 🚀 Live Production Endpoints
- **Frontend SPA**: [https://studymate.shreya-projects.site](https://studymate.shreya-projects.site)
- **Backend API Docs**: [https://api.studymate.shreya-projects.site/docs](https://api.studymate.shreya-projects.site/docs)

## ⚙️ Architecture & Tech Stack
- **Ingress Reverse Proxy**: Nginx (Ports 80 & 443 with free Let's Encrypt SSL/TLS certificates)
- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Python 3.11 + FastAPI + SQLAlchemy + Uvicorn
- **Database**: PostgreSQL 15
- **Orchestration**: Docker Compose + Systemd (`studymate.service`)
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/deploy.yml`)
