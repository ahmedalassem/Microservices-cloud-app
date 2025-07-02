# Microservices Multi-Environment Deployment Using Docker, Docker Compose, and Kubernetes

_A complete microservices application demonstrating environment-specific deployment and orchestration with Docker, Docker Compose, and Kubernetes._

---

## Project Overview

This repository contains a full-stack microservices platform, including Python Flask backend services, a React frontend, and MongoDB, all containerized and orchestrated for development, testing, and production environments. Infrastructure is managed as code for reproducibility and scalability.

---

## Table of Contents
- [DevOps Architecture & Operations](#devops-architecture--operations)
- [Directory Structure](#directory-structure)
- [Services](#services)
- [Environment Management](#environment-management)
- [Running & Deployment](#running--deployment)
- [API Overview](#api-overview)

---


## DevOps Architecture & Operations

### Infrastructure as Code
- All infrastructure is defined using YAML manifests (Kubernetes, Docker Compose) and configuration files included in the repository.

### Cloud Infrastructure Setup (EKS)
- The Kubernetes cluster is provisioned on AWS EKS using [eksctl](https://eksctl.io/):

```sh
eksctl create cluster \
  --name microservices-cluster \
  --region us-east-1 \
  --nodegroup-name default-ng \
  --nodes 2 \
  --nodes-min 2 \
  --nodes-max 6 \
  --node-type t3.medium \
  --managed
```
- This creates a managed EKS cluster in `us-east-1` with an autoscaling node group of t3.medium EC2 instances (2–6 nodes).
- After creation, deploy the application using the provided Kubernetes manifests for each service and environment.

### Containerization & Orchestration
- Each service and the frontend have dedicated Dockerfiles for different environments.
- Docker Compose files (`deployment-manifests/development/dev-docker-compose.yml`) enable local multi-service development.
- Kubernetes manifests for each environment are provided for all services (e.g., `reporting_Service/development/dev-reporting-service.yaml`).
- Nginx is configured as a reverse proxy using provided config files.
- Namespaces are managed via `deployment-manifests/namespaces.yaml`.

---

## Directory Structure

```
deployment-manifests/       # Infra configs (K8s, Compose, Nginx, Mongo, ConfigMaps)
insta-pay-front/            # React frontend app (Dockerfiles, configs, public, src)
reporting_Service/          # Python backend service for reporting
transactions_Service/       # Python backend service for transactions
user_service/               # Python backend service for user management
```

---

## Services

| Service                  | Description                                 |
|--------------------------|---------------------------------------------|
| deployment-manifests     | Infra configs for all environments          |
| insta-pay-front          | React-based frontend                        |
| reporting_Service        | Reporting microservice (Python/Flask)       |
| transactions_Service     | Transactions microservice (Python/Flask)    |
| user_service             | User management microservice (Python/Flask) |

---

## Environment Management

- **Environment Separation:**
  - Each environment (development, testing, production) has its own configuration files and manifests under each service's respective folder.
  - ConfigMaps and environment variables inject environment-specific settings.
- **Config Files:**
  - Kubernetes ConfigMaps: e.g., `deployment-manifests/development/dev-configmap.yaml`
  - Docker Compose files: e.g., `deployment-manifests/development/dev-docker-compose.yml`
- **Secrets:**
  - Secrets should be managed via Kubernetes Secrets or `.env` files (not included in this repository).

---

## Running & Deployment

### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes](https://kubernetes.io/) (for K8s deployment)
- [Node.js](https://nodejs.org/) (for frontend development)
- [Python 3.8+](https://www.python.org/) (for backend development)

### Local Development (Docker Compose)
```sh
cd deployment-manifests/development
docker-compose -f dev-docker-compose.yml up --build
```

### Kubernetes Deployment
Apply the environment-specific YAMLs for each service:
```sh
kubectl apply -f deployment-manifests/development/dev-mongo.yaml
kubectl apply -f deployment-manifests/development/dev-configmap.yaml
kubectl apply -f deployment-manifests/development/dev-nginx.conf
kubectl apply -f reporting_Service/development/dev-reporting-service.yaml
kubectl apply -f transactions_Service/development/dev-transaction-service.yaml
kubectl apply -f user_service/Development/dev-user-service.yaml
kubectl apply -f insta-pay-front/development/dev-insta-front.yaml
```
> Replace `development` with `testing` or `production` as needed.

### Running Frontend Locally
```sh
cd insta-pay-front
npm install
npm start
```

### Running Backend Services Locally
```sh
cd <service_dir>
pip install -r requirements.txt
python app.py
```

---

## API Overview

Each backend service exposes RESTful APIs. Example endpoints:
- **user_service**: `/user/register`, `/user/login`, `/user/profile`
- **transactions_Service**: `/transactions`, `/transactions/{id}`
- **reporting_Service**: `/reports`, `/reports/{id}`
> For detailed API documentation, see the `routes.py` or `routes/` in each service.




