# 🗄️ Create Database in pgAdmin

## Quick Steps

### Option 1: Using pgAdmin GUI (Easiest)

1. **Right-click on "Databases"** in the left panel
2. Click **"Create"** → **"Database..."**
3. In the dialog:
   - **Database name:** `apeer_db`
   - **Owner:** `postgres` (default)
   - Click **"Save"**

### Option 2: Using SQL Query

1. **Right-click on "postgres" database** (or any database)
2. Click **"Query Tool"**
3. **Run this SQL:**
   ```sql
   CREATE DATABASE apeer_db;
   ```
4. Click **Execute** (▶️ button) or press F5
5. You should see: `Query returned successfully`

## ✅ Verify Database Created

1. **Refresh** the Object Explorer (click refresh icon)
2. **Expand "Databases"**
3. You should see **`apeer_db`** listed

## 🚀 After Creating Database

1. **Start backend:**
   ```bash
   cd C:\Users\keith\Desktop\APEER\backend
   mvn spring-boot:run
   ```

2. **Spring Boot will automatically:**
   - Connect to `apeer_db`
   - Create all tables
   - Initialize sample data

## 📋 Database Details

- **Name:** `apeer_db`
- **Owner:** `postgres`
- **Host:** `localhost`
- **Port:** `5432`
- **Username:** `postgres`
- **Password:** `keith123`

## 🎯 That's It!

Once you create the database, start the backend and it will handle everything else automatically!

