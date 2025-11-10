# How to Find the Build Error

## Step 1: Open the Build Logs

Go to this URL:
```
https://expo.dev/accounts/htweb/projects/daily-peace/builds/cbbdd9c0-24b5-48fc-90df-59152dc11048#run-gradlew
```

## Step 2: Expand the "Run gradlew" Phase

Click on the **"Run gradlew"** step to see the detailed logs.

## Step 3: Find the Error

Scroll down to the bottom of the logs and look for:
- Lines starting with `ERROR:`
- Lines starting with `FAILURE:`
- Red/highlighted error messages
- Stack traces (lines starting with `at` or `Caused by:`)

## Step 4: Copy the Error

Copy the error message and the last 20-30 lines of the log output.

## Common Error Patterns to Look For:

1. **Resource compilation:**
   ```
   ERROR: AAPT: error: file failed to compile
   ```

2. **Dependency issues:**
   ```
   Could not resolve: ...
   FAILURE: Build failed with an exception
   ```

3. **Memory errors:**
   ```
   OutOfMemoryError
   Java heap space
   ```

4. **Gradle configuration:**
   ```
   Could not get unknown property
   Configuration with name not found
   ```

5. **Plugin errors:**
   ```
   Plugin [id: ...] was not found
   ```

---

**Once you have the error message, paste it here and we'll fix it!**

