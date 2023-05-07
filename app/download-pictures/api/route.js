import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const archiver = require("archiver");

const s3Client = new S3Client({
  region: process.env.S3_DOWNLOAD_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function listObjects(uploadPackageId) {
  try {
    const objectKeys = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_DOWNLOAD_BUCKET_NAME,
        Prefix: uploadPackageId,
      })
    );
    if (objectKeys && objectKeys.Contents) {
      return objectKeys.Contents.map((o) => o.Key);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error listing objects from s3", error);
  }
}

async function prepareZipForDownload(objectKeys) {
  return new Promise(async (resolve, reject) => {
    // create a write stream for the output file
    const output = fs.createWriteStream("example.zip");
    const archive = archiver("zip");

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    for (let objectKey of objectKeys) {
      let getObjectResponse;
      try {
        getObjectResponse = await s3Client.send(
          new GetObjectCommand({
            Bucket: process.env.S3_DOWNLOAD_BUCKET_NAME,
            Key: objectKey,
          })
        );
        const fileName = objectKey.split("/").pop();
        archive.append(getObjectResponse.Body, { name: fileName });
      } catch (error) {
        console.error("Error getting object from s3", error);
        reject(error);
      }
    }

    archive.finalize();
    archive.on("end", () => {
      resolve(output);
    });
  });
}

export async function POST(req) {
  try {
    const { uploadPackageId } = await req.json();
    const objectKeys = await listObjects(uploadPackageId);
    if (objectKeys.length) {
      const zipFile = await prepareZipForDownload(objectKeys);
      return new Response(zipFile, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename=${uploadPackageId}.zip`,
        },
      });
    } else {
      return NextResponse.json({ error: "upload package id not found" }).status(
        404
      );
    }
  } catch (err) {
    return NextResponse.error(err);
  }
}
