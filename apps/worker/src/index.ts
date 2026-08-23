import { Worker } from "bullmq";

const connection = { url: process.env.REDIS_URL ?? "redis://localhost:6379" };

const worker = new Worker("media-processing", async (job) => {
  switch (job.name) {
    case "image.process":
      return processImage(job.data);
    case "video.process":
      return processVideo(job.data);
    case "audio.process":
      return processAudio(job.data);
    default:
      throw new Error(`Unknown job: ${job.name}`);
  }
}, { connection });

worker.on("completed", (job) => console.log(`completed ${job.name}:${job.id}`));
worker.on("failed", (job, err) => console.error(`failed ${job?.name}:${job?.id}`, err));

async function processImage(data: unknown) {
  // TODO: thumbnail + metadata + optimization.
  return data;
}

async function processVideo(data: unknown) {
  // TODO: poster frame + duration + optional transcoding.
  return data;
}

async function processAudio(data: unknown) {
  // TODO: waveform/duration + optional normalized preview.
  return data;
}
