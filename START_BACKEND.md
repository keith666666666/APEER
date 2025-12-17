# 🚀 How to Start Backend

## Quick Start

Open a **new terminal** and run:

```bash
cd C:\Users\keith\Desktop\APEER\backend
mvn spring-boot:run
```

## What to Expect

1. **Maven will download dependencies** (first time only, ~30 seconds)
2. **Spring Boot will start** (~30-60 seconds)
3. **You'll see:**
   ```
   APEER Backend is running on http://localhost:8080
   Sample data initialization complete
   ```

## Verify It's Running

Open in browser: http://localhost:8080/api/auth/health

Should show: `APEER Backend is running`

## Keep Terminal Open

**Important:** Keep the terminal window open while the backend is running. Closing it will stop the server.

## Troubleshooting

### Port 8080 Already in Use
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Error
- Make sure PostgreSQL is running
- Check credentials in `application.properties`

### Build Errors
```bash
# Clean and rebuild
mvn clean install
mvn spring-boot:run
```

## Status

✅ Backend is now starting in the background. Wait 30-60 seconds, then refresh http://localhost:8080/api/auth/health

