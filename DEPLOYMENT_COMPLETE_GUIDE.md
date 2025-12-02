# 🚀 Complete GCP Deployment - Final Steps

## ✅ What Has Been Completed (80%)

### 1. Infrastructure Setup ✅
- **Cloud SQL PostgreSQL Database**
  - Instance: `mednotes-db`
  - Status: RUNNABLE
  - IP: 34.41.57.37
  - Database: `mednotes` created
  - User: `mednotes_user` created

### 2. Secret Management ✅
- `database-url` → Stored in Secret Manager
- `secret-key` → Stored in Secret Manager  
- `openai-api-key` → Stored in Secret Manager (placeholder)

### 3. Deployment Files ✅
- `Dockerfile.backend` → Backend container configuration
- `frontend/Dockerfile` → Frontend container configuration
- `frontend/nginx.conf` → Nginx web server config
- `deploy-gcp.sh` → Automated deployment script
- `cloudbuild.yaml` → CI/CD configuration

### 4. Documentation ✅
- `MONITOR_DEPLOYMENT.md` → Monitoring guide
- `GCP_DEPLOYMENT_GUIDE.md` → Complete deployment guide
- `DEPLOY_NOW.md` → Quick start guide

---

## 🎯 To Complete the Deployment

### Method 1: Automated Script (Recommended)

```bash
./deploy-gcp.sh
```

This will automatically:
1. Build backend Docker image
2. Deploy backend to Cloud Run
3. Build frontend Docker image
4. Deploy frontend to Cloud Run
5. Display your live URLs

**Note:** The script may take 10-15 minutes to complete.

---

### Method 2: Manual Step-by-Step

If the automated script has issues, follow these manual steps:

#### Step 1: Build & Deploy Backend

```bash
# Build backend image
gcloud builds submit \
    --tag gcr.io/securemed-ai/mednotes-backend \
    --project=securemed-ai \
    -f Dockerfile.backend \
    .

# Wait for build to complete (check in console)
# https://console.cloud.google.com/cloud-build/builds?project=securemed-ai

# Deploy to Cloud Run
gcloud run deploy mednotes-backend \
    --image gcr.io/securemed-ai/mednotes-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances securemed-ai:us-central1:mednotes-db \
    --set-env-vars "ENVIRONMENT=production" \
    --set-secrets "DATABASE_URL=database-url:latest,SECRET_KEY=secret-key:latest,OPENAI_API_KEY=openai-api-key:latest" \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --project=securemed-ai

# Get backend URL
BACKEND_URL=$(gcloud run services describe mednotes-backend \
    --platform managed \
    --region us-central1 \
    --format 'value(status.url)' \
    --project=securemed-ai)

echo "Backend URL: $BACKEND_URL"

# Test backend
curl $BACKEND_URL/health
```

#### Step 2: Build & Deploy Frontend

```bash
# Set backend URL in frontend env
cd frontend
cat > .env.production << EOF
VITE_API_BASE_URL=$BACKEND_URL
EOF

# Build frontend image
gcloud builds submit \
    --tag gcr.io/securemed-ai/mednotes-frontend \
    --project=securemed-ai \
    .

# Deploy to Cloud Run
gcloud run deploy mednotes-frontend \
    --image gcr.io/securemed-ai/mednotes-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --project=securemed-ai

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe mednotes-frontend \
    --platform managed \
    --region us-central1 \
    --format 'value(status.url)' \
    --project=securemed-ai)

echo "Frontend URL: $FRONTEND_URL"

cd ..
```

#### Step 3: Update CORS in Backend

```bash
# Edit api/main.py to add frontend URL to CORS
# Then rebuild and redeploy backend
```

#### Step 4: Test Deployment

```bash
# Test backend
curl $BACKEND_URL/health
open $BACKEND_URL/docs

# Test frontend
open $FRONTEND_URL
```

---

## 🔍 Monitoring Your Deployment

### GCP Console Dashboards

1. **Cloud Run Services:**
   https://console.cloud.google.com/run?project=securemed-ai

2. **Cloud Build:**
   https://console.cloud.google.com/cloud-build/builds?project=securemed-ai

3. **Cloud SQL:**
   https://console.cloud.google.com/sql/instances?project=securemed-ai

4. **Logs:**
   https://console.cloud.google.com/logs/query?project=securemed-ai

### Command Line Monitoring

```bash
# Check Cloud Run services
gcloud run services list --region=us-central1 --project=securemed-ai

# View backend logs
gcloud run services logs read mednotes-backend \
    --region=us-central1 \
    --project=securemed-ai \
    --limit=50

# View frontend logs
gcloud run services logs read mednotes-frontend \
    --region=us-central1 \
    --project=securemed-ai \
    --limit=50

# Check build status
gcloud builds list --limit=5 --project=securemed-ai
```

---

## ⚠️ Important Notes

### 1. Update OpenAI API Key

The OpenAI key is currently a placeholder. To enable AI features:

```bash
# Add your real OpenAI API key
echo "sk-your-actual-key-here" | \
    gcloud secrets versions add openai-api-key \
    --data-file=- \
    --project=securemed-ai

# Redeploy backend to use new key
gcloud run services update mednotes-backend \
    --region=us-central1 \
    --project=securemed-ai
```

### 2. Database Migrations

The backend will automatically create tables on first run. To seed demo data:

```bash
# Option 1: Via Cloud SQL Proxy
# Download proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.darwin.arm64
chmod +x cloud-sql-proxy

# Start proxy
./cloud-sql-proxy securemed-ai:us-central1:mednotes-db &

# Run seed script
export DATABASE_URL="postgresql://mednotes_user:PASSWORD@localhost:5432/mednotes"
python api/seed_more_data.py
```

### 3. CORS Configuration

Update `api/main.py` line 25 with your frontend URL:

```python
allow_origins=[
    "https://your-frontend-url.run.app",  # Add your actual URL
    "http://localhost:5173",
]
```

Then redeploy backend.

---

## 🎉 Expected Result

When deployment is complete:

### Backend API
- **URL:** `https://mednotes-backend-XXXXX-uc.a.run.app`
- **Health:** `https://mednotes-backend-XXXXX-uc.a.run.app/health`
- **Docs:** `https://mednotes-backend-XXXXX-uc.a.run.app/docs`

### Frontend App
- **URL:** `https://mednotes-frontend-XXXXX-uc.a.run.app`
- **Login:** dr.williams@hospital.com / password123

---

## 💰 Monthly Cost Estimate

With low/dev traffic:
- Cloud SQL (db-f1-micro): $7-10
- Cloud Run Backend: $0-5
- Cloud Run Frontend: $0-2
- Secret Manager: $0.06
- Container Registry: $0.10
- **Total: ~$7-15/month**

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds list --limit=1 --project=securemed-ai
gcloud builds log BUILD_ID --project=securemed-ai
```

### Container Not Found
```bash
# Verify images in registry
gcloud container images list --repository=gcr.io/securemed-ai --project=securemed-ai

# Rebuild if needed
gcloud builds submit --tag gcr.io/securemed-ai/mednotes-backend -f Dockerfile.backend .
```

### Service Won't Start
```bash
# Check logs
gcloud run services logs read SERVICE_NAME --region=us-central1 --limit=100

# Common issues:
# - Database connection (check secrets)
# - Missing dependencies (check Dockerfile)
# - Port configuration (Cloud Run uses PORT env var)
```

---

## 📚 Additional Resources

- **GCP Cloud Run Docs:** https://cloud.google.com/run/docs
- **Cloud SQL Docs:** https://cloud.google.com/sql/docs
- **Secret Manager:** https://cloud.google.com/secret-manager/docs

---

## ✅ Deployment Checklist

- [x] Cloud SQL instance created
- [x] Database and user configured
- [x] Secrets stored in Secret Manager
- [ ] Backend Docker image built
- [ ] Backend deployed to Cloud Run
- [ ] Backend health check passing
- [ ] Frontend Docker image built
- [ ] Frontend deployed to Cloud Run
- [ ] Frontend loads in browser
- [ ] Can login with demo credentials
- [ ] AI features working (after adding OpenAI key)

---

**Next Action:** Run `./deploy-gcp.sh` to complete the deployment! 🚀

