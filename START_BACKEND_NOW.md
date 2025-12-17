# 🚀 Start Backend Server

## Quick Start

**Open a NEW terminal window** and run:

```bash
cd C:\Users\keith\Desktop\APEER\backend
mvn spring-boot:run
```

## What You'll See

1. **Maven downloads dependencies** (first time, ~30 seconds)
2. **Spring Boot starts** (~30-60 seconds)
3. **You'll see:**
   ```
   APEER Backend is running on http://localhost:8080
   Sample data initialization complete
   ```

## ⚠️ Important

- **Keep the terminal window OPEN** while backend is running
- **Don't close it** - closing will stop the server
- **Wait 30-60 seconds** for it to fully start

## ✅ Verify It's Running

After 30-60 seconds, open in browser:
```
http://localhost:8080/api/auth/health
```

Should show: `APEER Backend is running`

## 🔄 After Backend Starts

1. The "Backend Not Running" error will disappear
2. You'll see "Backend Connected" indicator (green dot)
3. Google Sign-In will work!

## 🐛 Troubleshooting

### Port 8080 Already in Use
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### Database Connection Error
- Make sure PostgreSQL is running
- Check: `Get-Service postgresql*`

### Build Errors
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## 📝 Current Status

✅ Backend is starting in the background
⏳ Wait 30-60 seconds
🔄 Refresh your browser at http://localhost:5174

