# ⚡ Quick Fix: Start Backend

## 🎯 The Problem

Your backend server is not running on port 8080. The frontend is correctly detecting this and showing the error.

## ✅ Solution: Start Backend Manually

### Step 1: Open a New Terminal

**Important:** Open a **NEW terminal window** (don't use the one running frontend)

### Step 2: Navigate to Backend Folder

```bash
cd C:\Users\keith\Desktop\APEER\backend
```

### Step 3: Start Backend

```bash
mvn spring-boot:run
```

### Step 4: Wait for Startup

**Wait 30-60 seconds** for:
```
APEER Backend is running on http://localhost:8080
Sample data initialization complete
```

### Step 5: Verify

Open in browser: http://localhost:8080/api/auth/health

Should show: `APEER Backend is running`

## 🔄 What Happens Next

1. ✅ Backend starts successfully
2. ✅ Frontend detects backend is online
3. ✅ "Backend Not Running" error disappears
4. ✅ "Backend Connected" indicator appears (green dot)
5. ✅ Google Sign-In button works!

## ⚠️ Important Notes

- **Keep the terminal window OPEN** - closing it stops the server
- **Don't close the terminal** while using the app
- **Wait 30-60 seconds** for full startup

## 🐛 If It Doesn't Start

### Check PostgreSQL is Running
```bash
Get-Service postgresql*
```

### Check Port 8080
```bash
netstat -ano | findstr :8080
```

### Rebuild if Needed
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## 📋 Complete Command Sequence

Copy and paste this in a NEW terminal:

```bash
cd C:\Users\keith\Desktop\APEER\backend
mvn spring-boot:run
```

That's it! Just wait 30-60 seconds and refresh your browser.

