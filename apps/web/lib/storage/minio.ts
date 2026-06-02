import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { appConfig } from '@/lib/env';

const client = new S3Client({
  endpoint: appConfig.s3.endpoint,
  region: appConfig.s3.region,
  credentials: {
    accessKeyId: appConfig.s3.accessKey,
    secretAccessKey: appConfig.s3.secretKey,
  },
  forcePathStyle: appConfig.s3.forcePathStyle,
});

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: appConfig.s3.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return key;
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: appConfig.s3.bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

export { client as s3Client };
