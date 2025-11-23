# MongoDB Configuration Guide

This document explains how the application determines which database and collection to use for storing data.

## 1. The Database Name

The database name is defined in your connection string in the `.env` (or `.env.local`) file.

In this project, it is set to:
`MONGODB_URI=mongodb://localhost:27017/task-manager`

- **`mongodb://localhost:27017`**: This tells it to connect to the MongoDB server running on your local machine.
- **`/task-manager`**: This specific part tells MongoDB to use (or create if it doesn't exist) a database named **`task-manager`**.

## 2. The Collection Name

The collection name is determined by your Mongoose model definition in `models/Task.ts`.

```typescript
// models/Task.ts
mongoose.model<ITask>("Task", TaskSchema);
```

- **`"Task"`**: This is the name of the model provided to Mongoose.
- **Mongoose's Rule**: By default, Mongoose automatically **lowercases** and **pluralizes** this name to determine the collection name.
  - `Task` -> `task` -> **`tasks`**

## Summary

- **Database**: `task-manager` (derived from the `.env` URI)
- **Collection**: `tasks` (derived from the Model name "Task" in `models/Task.ts`)

If you open MongoDB Compass, you should see a database called `task-manager`, and inside it, a collection called `tasks`.
