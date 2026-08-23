# API map

## Archives

`POST /v1/archives`

Create an archive and creator membership.

`GET /v1/archives/:id`

Get private editing metadata for an authorized member.

`POST /v1/archives/:id/publish`

Validate completion and publish the final archive.

## Invites

`POST /v1/invites`

Create a single-use receiver invite.

`POST /v1/invites/:token/accept`

Redeem the invite and attach the receiver to the archive.

## Memories

`POST /v1/memories/:archiveId/upload-url`

Return a short-lived signed upload URL.

`POST /v1/memories/:archiveId`

Create the database memory record after storage upload.

`GET /v1/memories/:archiveId/feed`

Return ordered memories visible to the current member.

## Public/archive view

`GET /v1/archives/:slug/view`

Return the published archive presentation data.
