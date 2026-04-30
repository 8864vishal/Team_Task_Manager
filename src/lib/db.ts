import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
function getMongoUri() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }
  return MONGODB_URI;
}

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseConnection || {
  conn: null,
  promise: null,
};

global.mongooseConnection = cached;

export async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      dbName: process.env.MONGODB_DB_NAME || "team_task_manager",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
