# Backend & Frontend Connection Setup Guide

## 📋 Overview

The Healthcare Dashboard is a full-stack application with:
- **Frontend**: Next.js 16.2.4 running on `http://localhost:3000`
- **Backend**: Express.js API running on `http://localhost:5000`
- **Database**: Oracle DB (configured in backend/.env)

## 🚀 Quick Start

### Option 1: Automated (Recommended)

#### Windows:
```bash
start-all.bat
```

#### Mac/Linux:
```bash
chmod +x start-all.sh
./start-all.sh
```

### Option 2: Manual Start

#### Terminal 1 - Start Backend:
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

#### Terminal 2 - Start Frontend:
```bash
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend (.env)
Located at: `backend/.env`
```
DB_USER=HEALTHCARE
DB_PASSWORD=1234
DB_CONNECT=localhost:1521/XEPDB1
PORT=5000
```

### Frontend (.env.local)
Located at: `.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 📡 API Endpoints

All endpoints are accessible at `http://localhost:5000/api`

### Health Check
- **GET** `/api/health` - Check backend and database status

### Patients
- **GET** `/api/patients` - Get all patients
- **POST** `/api/patients` - Add a new patient

### Appointments
- **GET** `/api/appointments` - Get all appointments
- **POST** `/api/appointments` - Create an appointment

### Prescriptions
- **GET** `/api/prescriptions` - Get all prescriptions
- **POST** `/api/prescriptions` - Create a prescription

## 📦 API Service Usage in Frontend

The frontend uses a centralized API service (`app/services/api.js`) for all backend communication:

```javascript
import { 
  patientAPI, 
  appointmentAPI, 
  prescriptionAPI, 
  dashboardAPI,
  healthAPI 
} from "@/app/services/api";

// Get all patients
const patients = await patientAPI.getAll();

// Add a new patient
await patientAPI.add({ name: "John Doe", age: 45, contact: "123-456-7890" });

// Get dashboard data (combines multiple endpoints)
const dashboardData = await dashboardAPI.getData();
```

## 🗄️ Database Schema

### Patients Table
```sql
CREATE TABLE patients (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100),
  age NUMBER,
  contact VARCHAR2(20)
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id NUMBER PRIMARY KEY,
  patient_id NUMBER,
  doctor_id NUMBER,
  appointment_date DATE,
  status VARCHAR2(20)
);
```

### Prescriptions Table
```sql
CREATE TABLE prescriptions (
  prescription_id NUMBER PRIMARY KEY,
  appointment_id NUMBER,
  created_date DATE
);
```

### Prescription Items Table
```sql
CREATE TABLE prescription_items (
  item_id NUMBER PRIMARY KEY,
  prescription_id NUMBER,
  medicine_id NUMBER,
  quantity NUMBER
);
```

## 🔗 Frontend Features Using Backend Data

### Dashboard HomePage (`app/homepage/page.tsx`)
- Fetches total patient count from backend
- Displays real-time data
- Shows health status of backend connection

### KPI Cards
- **Total Patients**: Live count from database
- **Appointments Today**: Fetched from appointments endpoint
- **Available Medicines**: Mock data (ready for inventory endpoint)
- **Low Stock Alerts**: Mock data (ready for inventory endpoint)

## ✅ Verification Steps

1. **Check Backend Health**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   { "status": "Database connected successfully" }
   ```

2. **Fetch Patients**:
   ```bash
   curl http://localhost:5000/api/patients
   ```

3. **Open Frontend**:
   - Navigate to `http://localhost:3000`
   - Check if KPI cards show live patient data
   - Verify no console errors in browser DevTools

## 🐛 Troubleshooting

### Backend Connection Failed
- Verify backend is running on port 5000
- Check Oracle DB connection in `backend/.env`
- Ensure `NEXT_PUBLIC_API_BASE_URL` matches backend URL

### API Calls Failing
- Check browser console for CORS errors
- Verify backend is running: `http://localhost:5000/api/health`
- Check network tab in browser DevTools

### Database Connection Issues
- Verify Oracle DB is running
- Check credentials in `backend/.env`
- Test connection: `node -e "require('./backend/db/db.js')()"`

## 📝 Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api)

### Backend (.env)
- `DB_USER` - Oracle database user
- `DB_PASSWORD` - Oracle database password
- `DB_CONNECT` - Oracle connection string
- `PORT` - Server port (default: 5000)

## 🚀 Deployment

For production deployment:

1. **Backend**:
   - Update `DB_CONNECT` with production database URL
   - Set secure `DB_PASSWORD`
   - Change `PORT` as needed
   - Deploy to server/cloud platform

2. **Frontend**:
   - Update `.env.local` with production API URL
   - Run `npm run build`
   - Deploy to Vercel or static hosting

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Oracle Database Documentation](https://docs.oracle.com/en/database/)
- [Lucide React Icons](https://lucide.dev/)

---

**Last Updated**: May 2, 2026
**Version**: 1.0.0
