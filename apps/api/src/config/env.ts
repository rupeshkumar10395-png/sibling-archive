export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  storageBucket: process.env.STORAGE_BUCKET ?? "",
  redisUrl: process.env.REDIS_URL ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
};
