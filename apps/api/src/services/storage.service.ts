export type UploadIntent = {
  archiveId: string;
  mediaType: "image" | "video" | "audio" | "file";
  contentType: string;
  sizeBytes: number;
};

export async function createUploadUrl(_intent: UploadIntent) {
  // TODO: create an object key and a short-lived presigned PUT URL.
  throw new Error("Not implemented");
}

export async function createViewUrl(_objectKey: string) {
  // TODO: return a short-lived signed GET URL.
  throw new Error("Not implemented");
}
