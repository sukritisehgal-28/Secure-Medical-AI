# 📊 GCP Deployment Monitoring Guide

**Project:** Secure Med Notes AI
**Project ID:** `securemed-ai`
**Account:** `suse7498@colorado.edu`

---

## 🎯 Quick Access Links

### Main Dashboard
**Project Overview:**
```
https://console.cloud.google.com/home/dashboard?project=securemed-ai
```

### Monitor Specific Services

#### 1. Cloud SQL (Database)
**View PostgreSQL Instance:**
```
https://console.cloud.google.com/sql/instances?project=securemed-ai
```

**What to check:**
- ✅ Instance Status: Should be "Running" (green)
- ✅ Instance Name: `mednotes-db`
- ✅ Database Version: PostgreSQL 15
- ✅ Tier: db-f1-micro
- ✅ Region: us-central1

**View Operations:**
```
https://console.cloud.google.com/sql/instances/mednotes-db/operations?project=securemed-ai
```

#### 2. Cloud Run (Backend & Frontend)
**View All Cloud Run Services:**
```
https://console.cloud.google.com/run?project=securemed-ai
```

**Backend Service:**
```
https://console.cloud.google.com/run/detail/us-central1/mednotes-backend?project=securemed-ai
```

**Frontend Service:**
```
https://console.cloud.google.com/run/detail/us-central1/mednotes-frontend?project=securemed-ai
```

**What to check:**
- ✅ Status: "Serving traffic" (green)
- ✅ Latest Revision: Should show recent deployment
- ✅ URL: Click to open your live app
- ✅ Metrics: Request count, latency, errors

#### 3. Cloud Build (CI/CD)
**View Build History:**
```
https://console.cloud.google.com/cloud-build/builds?project=securemed-ai
```

**What to check:**
- ✅ Build Status: "Success" (green) or "In Progress" (blue)
- ✅ Build Logs: Click on build for detailed logs
- ✅ Images Built: Should see backend and frontend images

#### 4. Container Registry
**View Docker Images:**
```
https://console.cloud.google.com/gcr/images/securemed-ai?project=securemed-ai
```

**Expected Images:**
- `gcr.io/securemed-ai/mednotes-backend`
- `gcr.io/securemed-ai/mednotes-frontend`

#### 5. Secret Manager
**View Secrets:**
```
https://console.cloud.google.com/security/secret-manager?project=securemed-ai
```

**Expected Secrets:**
- `database-url` - PostgreSQL connection string
- `secret-key` - Application secret key
- `openai-api-key` - OpenAI API key (you need to add this)

#### 6. Logging
**View All Logs:**
```
https://console.cloud.google.com/logs/query?project=securemed-ai
```

**Backend Logs Query:**
```
resource.type="cloud_run_revision"
resource.labels.service_name="mednotes-backend"
```

**Frontend Logs Query:**
```
resource.type="cloud_run_revision"
resource.labels.service_name="mednotes-frontend"
```

#### 7. Monitoring & Metrics
**Cloud Monitoring Dashboard:**
```
https://console.cloud.google.com/monitoring?project=securemed-ai
```

**Cloud Run Metrics:**
```
https://console.cloud.google.com/monitoring/dashboards/resourceList/cloud_run_revision?project=securemed-ai
```

#### 8. Billing
**View Costs:**
```
https://console.cloud.google.com/billing/linkedaccount?project=securemed-ai
```

**What to monitor:**
- ✅ Daily costs
- ✅ Forecasted monthly costs
- ✅ Set budget alerts (recommended: $50/month)

---

## 🔍 How to Check Cloud SQL Creation Status

### Option 1: GCP Console (Visual)
1. Go to: https://console.cloud.google.com/sql/instances?project=securemed-ai
2. Look for instance: `mednotes-db`
3. Status should show:
   - 🔵 **Creating** - In progress
   - 🟢 **Running** - Complete and ready!

### Option 2: Command Line
```bash
# Check instance status
gcloud sql instances describe mednotes-db --project=securemed-ai

# List ongoing operations
gcloud sql operations list --instance=mednotes-db --project=securemed-ai
```

---

## 🚀 How to Check Cloud Run Deployments

### Check if Service is Live
```bash
# List all Cloud Run services
gcloud run services list --platform=managed --region=us-central1 --project=securemed-ai

# Get backend URL
gcloud run services describe mednotes-backend \
  --platform=managed \
  --region=us-central1 \
  --project=securemed-ai \
  --format='value(status.url)'

# Get frontend URL
gcloud run services describe mednotes-frontend \
  --platform=managed \
  --region=us-central1 \
  --project=securemed-ai \
  --format='value(status.url)'
```

### View Live Logs
```bash
# Stream backend logs in real-time
gcloud run services logs tail mednotes-backend \
  --region=us-central1 \
  --project=securemed-ai

# Stream frontend logs
gcloud run services logs tail mednotes-frontend \
  --region=us-central1 \
  --project=securemed-ai
```

---

## 📈 Expected Timeline

| Task | Duration | Status Check |
|------|----------|--------------|
| Enable APIs | ~1 min | ✅ Complete |
| Create Cloud SQL | 5-10 min | 🔵 In Progress |
| Build Backend Image | 3-5 min | ⏳ Pending |
| Deploy Backend | 2-3 min | ⏳ Pending |
| Build Frontend Image | 2-3 min | ⏳ Pending |
| Deploy Frontend | 2-3 min | ⏳ Pending |
| **Total** | **~20-30 min** | |

---

## ✅ Success Indicators

### Cloud SQL Ready
- Status: **Running** (green checkmark)
- Connection name: `securemed-ai:us-central1:mednotes-db`
- Public IP assigned

### Backend Deployed
- Service Status: **Serving traffic**
- URL active: `https://mednotes-backend-xxxxx-uc.a.run.app`
- Health check passing: `/health` returns 200
- API docs accessible: `/docs`

### Frontend Deployed
- Service Status: **Serving traffic**
- URL active: `https://mednotes-frontend-xxxxx-uc.a.run.app`
- Can load landing page
- Can login with demo credentials

---

## 🔴 Common Issues & Solutions

### Issue 1: Cloud SQL Still Creating After 15 Minutes
**Solution:**
```bash
# Check operations
gcloud sql operations list --instance=mednotes-db --project=securemed-ai

# If stuck, may need to delete and recreate
gcloud sql instances delete mednotes-db --project=securemed-ai
# Then run deployment script again
```

### Issue 2: Build Fails with "Permission Denied"
**Solution:**
```bash
# Grant Cloud Build service account permissions
gcloud projects add-iam-policy-binding securemed-ai \
  --member="serviceAccount:957293469884@cloudbuild.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder"
```

### Issue 3: Cloud Run Shows "Container Failed to Start"
**Solution:**
1. Check logs in console
2. Common causes:
   - Port mismatch (must use PORT env variable)
   - Missing dependencies
   - Database connection failed

```bash
# View detailed logs
gcloud run services logs read mednotes-backend \
  --region=us-central1 \
  --project=securemed-ai \
  --limit=100
```

### Issue 4: Frontend Can't Connect to Backend
**Solution:**
1. Check CORS settings in backend
2. Update frontend environment variable:
```bash
# In frontend/.env.production
VITE_API_BASE_URL=https://YOUR-BACKEND-URL
```
3. Rebuild frontend

---

## 📞 Quick Commands Reference

```bash
# Set project (run this first)
gcloud config set project securemed-ai

# Check what's running
gcloud sql instances list
gcloud run services list --region=us-central1

# View recent builds
gcloud builds list --limit=5

# Test backend health
curl https://YOUR-BACKEND-URL/health

# Test backend API docs
open https://YOUR-BACKEND-URL/docs

# Open frontend
open https://YOUR-FRONTEND-URL
```

---

## 💰 Cost Monitoring

**Expected Monthly Costs (Dev/Low Traffic):**
- Cloud SQL (db-f1-micro): $7-10
- Cloud Run Backend: $0-5 (with min-instances=0)
- Cloud Run Frontend: $0-2
- Container Registry: $0.10
- Secret Manager: $0.06
- **Total: ~$7-15/month**

**Set Up Budget Alert:**
```bash
# View current project billing
gcloud billing projects describe securemed-ai

# View costs (requires billing account ID)
# Get from: https://console.cloud.google.com/billing
```

---

## 🎉 When Everything is Ready

You'll know deployment is complete when:

1. ✅ Cloud SQL instance shows "Running"
2. ✅ Both Cloud Run services show "Serving traffic"
3. ✅ Backend `/health` endpoint returns 200
4. ✅ Frontend loads in browser
5. ✅ Can login with: `dr.williams@hospital.com` / `password123`

**Your live URLs will be:**
- Frontend: `https://mednotes-frontend-xxxxx-uc.a.run.app`
- Backend: `https://mednotes-backend-xxxxx-uc.a.run.app`
- API Docs: `https://mednotes-backend-xxxxx-uc.a.run.app/docs`

---

**Happy Deploying! 🚀**
