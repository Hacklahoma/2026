Below are step-by-step instructions to download, install, and run MongoDB on a Mac using Homebrew:

---

### 1. Install Homebrew (if not already installed)

If you haven't installed Homebrew yet, open Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions to complete the installation.

---

### 2. Install MongoDB Community Edition

With Homebrew installed, run the following command in Terminal to install MongoDB Community Edition:

```bash
brew tap mongodb/brew
brew install mongodb-community
```

This will download and install the latest MongoDB Community Edition package.

---

### 3. Start MongoDB as a Service

Once installed, you can start MongoDB using Homebrew services. Run the following command:

```bash
brew services start mongodb-community
```

This will launch MongoDB as a background service. You can confirm it’s running with:

```bash
brew services list
```

You should see an entry for `mongodb-community` with a status of "started."

---

### 4. Connect to MongoDB

To verify that MongoDB is running, you can open Terminal and type:

```bash
mongosh
```

If the installation was successful, you should see a shell prompt similar to:

```
Current Mongosh Log ID: 63d3b0c7...
Connecting to: mongodb://127.0.0.1:27017/
```

This means you are connected to your local MongoDB instance.

---

### 5. Create a Database and Test

Within the MongoDB shell, you can create a database and test it:

1. Switch to a new database (e.g., `hacklahoma`):

   ```javascript
   use hacklahoma
   ```

2. Insert a test document:

   ```javascript
   db.users.insertOne({ firstName: "Test", lastName: "User", email: "test@example.com" })
   ```

3. Verify that the document was inserted:

   ```javascript
   db.users.find().pretty()
   ```

You should see the inserted document in the output.

---

### 6. Stopping MongoDB

When you want to stop MongoDB, you can run:

```bash
brew services stop mongodb-community
```

---

### Summary

- **Install Homebrew** if necessary.
- **Tap and install MongoDB Community** using Homebrew.
- **Start MongoDB as a service** with `brew services start mongodb-community`.
- **Connect using `mongosh`** and verify your installation by creating a test database.
