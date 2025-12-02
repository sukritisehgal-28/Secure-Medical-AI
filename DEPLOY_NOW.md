# 🚀 Quick Deploy to GCP - Start Here!

**Project:** Secure Medical Notes AI
**GCP Project ID:** `securemed-ai`
**GCP Project Number:** `957293469884`
**Your Email:** `suse7498@colorado.edu`

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites Check
```bash
# 1. Verify you're logged in
gcloud auth list

# 2. Set your project
gcloud config set project securemed-ai

# 3. Verify project is set
gcloud config get-value project
# Should output: securemed-ai
```

### One-Command Deployment 🎯

```bash
# Make script executable and run
chmod +x deploy-gcp.sh
./deploy-gcp.sh
```

**That's it!** ✅ The script will:
- Enable all required GCP APIs
- Create PostgreSQL database
- Deploy backend API
- Deploy React frontend
- Display your app URLs

---

## 📱 Expected Result

After ~10-15 minutes, you'll see:

```
======================================
Deployment Complete!
======================================

Backend API:  https://mednotes-backend-xxxxx-uc.a.run.app
Frontend App: https://mednotes-frontend-xxxxx-uc.a.run.app

API Docs: https://mednotes-backend-xxxxx-uc.a.run.app/docs
======================================
```

---

## 🧪 Test Your Deployment

### 1. Test Backend
```bash
# Replace with your actual backend URL
curl https://mednotes-backend-xxxxx-uc.a.run.app/health

# Expected: {"status":"healthy","version":"1.0.0"}
```

### 2. Test API Docs
```bash
# Open Swagger UI
open https://mednotes-backend-xxxxx-uc.a.run.app/docs
```

### 3. Test Frontend
```bash
# Open React app
open https://mednotes-frontend-xxxxx-uc.a.run.app
```

### 4. Login with Demo Credentials
- **Doctor:** dr.williams@hospital.com / password123
- **Nurse:** nurse.davis@hospital.com / password123

---

## 🔧 If Something Goes Wrong

### Check Deployment Status
```bash
# View recent deployments
gcloud run services list

# Check backend logs
gcloud run services logs read mednotes-backend --region us-central1 --limit 50

# Check frontend logs
gcloud run services logs read mednotes-frontend --region us-central1 --limit 50
```

### Common Fixes

#### Issue: "APIs not enabled"
```bash
# Re-run API enablement
gcloud services enable cloudbuild.googleapis.com run.googleapis.com sqladmin.googleapis.com
```

#### Issue: "Permission denied"
```bash
# Re-authenticate
gcloud auth login
gcloud config set project securemed-ai
```

#### Issue: "Build timeout"
```bash
# Increase timeout and retry
gcloud builds submit --timeout=30m --tag gcr.io/securemed-ai/mednotes-backend -f Dockerfile.backend .
```

---

## 📊 Monitor Your App

### View in Cloud Console
```bash
# Open Cloud Run dashboard
open "https://console.cloud.google.com/run?project=securemed-ai"

# Open Cloud SQL dashboard
open "https://console.cloud.google.com/sql?project=securemed-ai"

# View all services
open "https://console.cloud.google.com/home/dashboard?project=securemed-ai"
```

### Check Costs
```bash
# View billing
open "https://console.cloud.google.com/billing"
```

**Expected Monthly Cost:** ~$7-15 for dev/low traffic

---

## 🔄 Update & Redeploy

When you make code changes:

```bash
# Option 1: Full redeployment
./deploy-gcp.sh

# Option 2: Backend only
gcloud builds submit --tag gcr.io/securemed-ai/mednotes-backend -f Dockerfile.backend .
gcloud run deploy mednotes-backend --image gcr.io/securemed-ai/mednotes-backend --region us-central1

# Option 3: Frontend only
cd frontend
gcloud builds submit --tag gcr.io/securemed-ai/mednotes-frontend .
gcloud run deploy mednotes-frontend --image gcr.io/securemed-ai/mednotes-frontend --region us-central1
cd ..
```

---

## 📚 Need More Details?

**Full Documentation:** [GCP_DEPLOYMENT_GUIDE.md](./GCP_DEPLOYMENT_GUIDE.md)

The complete guide includes:
- Detailed architecture explanation
- Manual step-by-step deployment
- Cost optimization tips
- Monitoring and logging setup
- CI/CD configuration
- Troubleshooting guide

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [ ] GCloud CLI installed (`gcloud --version`)
- [ ] Logged in (`gcloud auth login`)
- [ ] Project set (`gcloud config set project securemed-ai`)
- [ ] Docker running (`docker ps`)

After deployment, verify:

- [ ] Backend health check works
- [ ] API docs accessible
- [ ] Frontend loads
- [ ] Can login with demo credentials
- [ ] Database connected (check backend logs)

---

## 🎯 What Gets Deployed

| Component | Service | URL Pattern |
|-----------|---------|-------------|
| **Backend API** | Cloud Run | `https://mednotes-backend-*-uc.a.run.app` |
| **Frontend** | Cloud Run | `https://mednotes-frontend-*-uc.a.run.app` |
| **Database** | Cloud SQL | Internal (via Unix socket) |
| **Secrets** | Secret Manager | Managed by GCP |
| **Images** | Container Registry | `gcr.io/securemed-ai/*` |

---

## 💡 Tips

### Save Money
```bash
# Use minimum instances=0 for dev (already configured)
# This means: $0 when not in use!

# For production, use minimum instances=1 to reduce cold starts
gcloud run services update mednotes-backend --region us-central1 --min-instances 1
```

### Speed Up Deploys
```bash
# Build images in parallel
gcloud builds submit --tag gcr.io/securemed-ai/mednotes-backend -f Dockerfile.backend . &
cd frontend && gcloud builds submit --tag gcr.io/securemed-ai/mednotes-frontend . &
wait
```

### View Real-time Logs
```bash
# Stream logs in real-time
gcloud run services logs tail mednotes-backend --region us-central1
```

---

## 🆘 Get Help

1. **Check Logs:** `gcloud run services logs read SERVICE_NAME --region us-central1`
2. **Cloud Console:** https://console.cloud.google.com/run?project=securemed-ai
3. **Full Guide:** [GCP_DEPLOYMENT_GUIDE.md](./GCP_DEPLOYMENT_GUIDE.md)
4. **GitHub Issues:** https://github.com/sakshiasati17/secure-med-notes-ai/issues

---

**Ready to deploy? Run:** `./deploy-gcp.sh` 🚀
