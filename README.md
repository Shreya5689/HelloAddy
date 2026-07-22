# 📚 StudyMate — AI-Powered Competitive Programming & Learning Platform

[![Live Application](https://img.shields.io/badge/Production-studymate.shreya--projects.site-brightgreen?style=for-the-badge&logo=nginx)](https://studymate.shreya-projects.site)
[![API Docs](https://img.shields.io/badge/API_Docs-api.studymate.shreya--projects.site-blue?style=for-the-badge&logo=fastapi)](https://api.studymate.shreya-projects.site/docs)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-orange?style=for-the-badge&logo=githubactions)](https://github.com/Shreya5689/HelloAddy/actions)
[![Docker](https://img.shields.io/badge/Docker-Docker_Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**StudyMate** is a unified, intelligent learning assistant and competitive programming platform designed to eliminate context switching, automate problem-solving insights, and accelerate Data Structures & Algorithms (DSA) mastery.

---

## 🚀 Production Live URLs

* **Frontend Web Application**: [https://studymate.shreya-projects.site](https://studymate.shreya-projects.site)
* **Backend API & Swagger Docs**: [https://api.studymate.shreya-projects.site/docs](https://api.studymate.shreya-projects.site/docs)

---

## 🎯 The Problem

1. **Fragmented Learning Ecosystem**: Developers and competitive programmers waste hours context-switching between **LeetCode**, **Codeforces**, **YouTube video tutorials**, personal note-taking apps, and IDEs.
2. **Passive Video Consumption**: Watching 30-minute YouTube video editorials is time-inefficient when a developer only needs a quick logic breakdown, hint, or pseudocode algorithm.
3. **Lack of Centralized Tracking**: Tracking problem-solving velocity, bookmarked questions, and revision wishlists across multiple platforms leads to lost progress and unorganized prep.

---

## 💡 The Novelty & Our Solution

**StudyMate** addresses these challenges by merging multi-platform problem indexing with **AI-driven video transcript analysis**:

* **AI-Powered Video-to-Editorial Synthesizer**: Utilizes **Google Gemini 2.0 AI** combined with the **YouTube Transcript API** to process lengthy video solutions into structured, instantly readable markdown editorials (complete with intuition, time complexity, and step-by-step code breakdowns).
* **Multi-Platform Problem Sync**: Unified scraping and indexing for **LeetCode** and **Codeforces** problems, categorized by difficulty, tags, and rank-wise sheets.
* **Interactive Workspaces & Wishlists**: Personalized workspaces allowing users to organize problem sets, track solved milestones, and write notes directly alongside problem statements.
* **Seamless Authentication & OTP System**: Built-in JWT authentication with email OTP verification for secure user state persistence.

---

## 🏛️ Key Architectural Decisions

```
                                  PUBLIC INTERNET
                                         |
                                HTTP:80  |  HTTPS:443
                                         v
                         +-------------------------------+
                         |   Nginx Ingress (Host: 80/443)|
                         |   SSL TLS (Let's Encrypt)     |
                         +---------------+---------------+
                                         |
               +-------------------------+-------------------------+
               | (Private Docker Bridge Network: app-network)      |
               |                                                   |
               | Host: api.studymate.shreya-projects.site           | Host: studymate.shreya-projects.site
               v                                                   v
    +----------------------+                            +----------------------+
    | Backend Service      |                            | Frontend Service     |
    | (FastAPI:8000)       |                            | (Vite/Nginx:80)      |
    +----------+-----------+                            +----------------------+
               |
               v
    +----------------------+
    | PostgreSQL DB        |
    | (postgres:5432)      |
    +----------------------+
```

### 1. Ingress Isolation & Port Hardening
Only **Nginx (`nginx_proxy`)** exposes ports `80` and `443` to the host network. All internal microservices (`frontend_app`, `backend_api`, `postgres_db`) communicate exclusively over an isolated, non-routable Docker bridge network (`app-network`). Direct external access to database port `5432` or API port `8000` is completely blocked.

### 2. Multi-Stage Production Frontend Builds
The frontend is compiled using a multi-stage Docker build:
* **Stage 1 (Build)**: Node 20 Alpine compiles the React 19 / Vite bundle into static HTML/JS/CSS assets.
* **Stage 2 (Serving)**: Nginx Alpine serves the compiled static distribution on port 80 with single-page application (SPA) client-side fallback (`try_files $uri $uri/ /index.html`).

### 3. Self-Healing Infrastructure with Systemd
The application stack is wrapped in a Linux systemd service unit (`/etc/systemd/system/studymate.service`). In the event of a system reboot, power failure, or kernel update, the Linux host automatically starts up all containers via `docker compose up -d`.

### 4. Zero-Downtime CI/CD Automation
Integrated with **GitHub Actions** (`.github/workflows/deploy.yml`). On every push to the `main` branch, GitHub Actions executes an automated deployment over SSH: fetching latest code, rebuilding Docker layers, and restarting service containers seamlessly.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | **React 19**, **Vite**, **TailwindCSS v4**, **React Router 7**, **Lucide React**, **Zustand** (State), **Axios** |
| **Backend API** | **Python 3.11**, **FastAPI**, **SQLAlchemy ORM**, **Uvicorn**, **Strawberry GraphQL**, **Pydantic v2** |
| **AI & External APIs** | **Google Gemini AI** (`google-genai`), **YouTube Transcript API**, **LeetCode API**, **Codeforces API** |
| **Database** | **PostgreSQL 15** (Alpine), **AsyncPG** |
| **Reverse Proxy & SSL** | **Nginx**, **Let's Encrypt Certbot** (HTTP-01 Challenge, TLS 1.2/1.3) |
| **DevOps & Cloud** | **Oracle Cloud Infrastructure (OCI)**, **Docker & Docker Compose**, **Systemd**, **GitHub Actions** |

---

## 📖 Full Step-by-Step Setup & Hosting Guide

### 1. Local Development Setup

#### Prerequisites
* Node.js v20+
* Python 3.11+
* Docker & Docker Compose

#### Clone & Environment Setup
```bash
git clone https://github.com/Shreya5689/HelloAddy.git StudyMate
cd StudyMate

# Create root environment file
cp .env.example .env
```

#### Run via Docker Compose locally:
```bash
docker compose up --build
```
Access locally at:
* Frontend: `http://localhost`
* Backend API Docs: `http://localhost:8000/docs`

---

### 2. Hosting on Oracle Cloud Infrastructure (OCI) & Namecheap

#### Step A: Configure Namecheap DNS
In **Namecheap Advanced DNS** for `shreya-projects.site`, add two A-Records:
* **A Record**: `studymate` $\rightarrow$ `YOUR_ORACLE_VM_PUBLIC_IP`
* **A Record**: `api.studymate` $\rightarrow$ `YOUR_ORACLE_VM_PUBLIC_IP`

#### Step B: Oracle VCN Ingress Rules & Host Firewall
1. In **Oracle Cloud Console**, navigate to **Networking** $\rightarrow$ **VCN Security Lists** $\rightarrow$ **Default Security List**.
2. Add Ingress Rule: **Source**: `0.0.0.0/0`, **Protocol**: `TCP`, **Port Range**: `80,443`.
3. On the Oracle VM, run host firewall commands:
   ```bash
   sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable
   ```

#### Step C: SSL Certificate Generation & Systemd Enablement
1. Generate SSL certificates via Certbot:
   ```bash
   sudo certbot certonly --standalone \
     -d studymate.shreya-projects.site \
     -d api.studymate.shreya-projects.site \
     --non-interactive --agree-tos -m admin@shreya-projects.site
   ```
2. Enable Systemd unit (`studymate.service`):
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable studymate.service
   sudo systemctl start studymate.service
   ```

#### Step D: GitHub Actions CI/CD Pipeline Setup
Add these 3 repository secrets in **GitHub** $\rightarrow$ **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**:
* **`SERVER_HOST`**: `129.159.227.116`
* **`SERVER_USER`**: `ubuntu`
* **`SERVER_SSH_KEY`**: Content of your `cat ~/.ssh/oracle_vm.key`

Now, any push to `main` will automatically build and deploy the updated application live to production!

---

## 🔍 Operations, Logging & Debugging Cheat-Sheet

### 1. Real-Time Container Logs
```bash
# Stream live logs for all running microservices
cd /var/www/StudyMate
sudo docker compose logs -f

# Stream specific container logs:
sudo docker compose logs -f backend   # FastAPI Backend
sudo docker compose logs -f nginx     # Nginx Reverse Proxy
sudo docker compose logs -f db        # PostgreSQL Database
sudo docker compose logs -f frontend  # React Web App
```

### 2. Systemd Host Auto-Start Logs
```bash
# Inspect systemd boot and auto-restart logs
journalctl -u studymate.service -n 50 -f
```

### 3. Remote Logging & Debugging via SSH (From Local Mac Terminal)
```bash
# View Backend API logs remotely:
ssh -i ~/.ssh/oracle_vm.key ubuntu@129.159.227.116 "cd /var/www/StudyMate && sudo docker compose logs --tail=50 backend"

# View Nginx Reverse Proxy logs remotely:
ssh -i ~/.ssh/oracle_vm.key ubuntu@129.159.227.116 "cd /var/www/StudyMate && sudo docker compose logs --tail=50 nginx"

# View Database logs remotely:
ssh -i ~/.ssh/oracle_vm.key ubuntu@129.159.227.116 "cd /var/www/StudyMate && sudo docker compose logs --tail=50 db"

# View Systemd host boot logs remotely:
ssh -i ~/.ssh/oracle_vm.key ubuntu@129.159.227.116 "journalctl -u studymate.service -n 30"

# Query remote PostgreSQL database tables remotely:
ssh -i ~/.ssh/oracle_vm.key ubuntu@129.159.227.116 "sudo docker exec -i postgres_db psql -U postgres -d graphql_db -c '\dt'"
```

### 4. Interactive Database Shell
```bash
# Interactive PostgreSQL CLI inside db container on server
sudo docker exec -it postgres_db psql -U postgres -d graphql_db
```

---


## 🤝 Authors & Credits

* **Shreya Upadhyay** ([@Shreya5689](https://github.com/Shreya5689)) — *Lead Developer & Architect*

