export async function createInvite(archiveId: string, receiverEmail: string) {
  // TODO: store a hashed, single-use token and send the invite email.
  return { archiveId, receiverEmail };
}
