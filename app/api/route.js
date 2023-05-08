// import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({ respuesta: "endpoint GET" });
// }

import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// This API Route uploads photos to aws s3, there is a lambda function that then erases the photo from the upload bucket, so don't look for the uploaded picture there, instead, look for the uploaded pictures in the download bucket

export const segmentConfig = {
  runtime: {
    api: {
      responseLimit: false,
      bodyParser: false,
    },
  },
};

const s3Client = new S3Client({
  region: process.env.S3_UPLOAD_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

function generateFileName(
  eventNumber,
  photographerName,
  uploadPackageId,
  photoName
) {
  return `${uploadPackageId}/${eventNumber}/${photographerName}/${photoName}`;
}

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_UPLOAD_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(
        null,
        generateFileName(
          req.body.eventNumber,
          req.body.photographerName,
          req.uploadPackageId,
          file.originalname
        )
      );
    },
  }),
}).array("images");

export async function POST(req) {
  req.uploadPackageId = uuidv4();
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return NextResponse.json({ uploadPackageId: req.uploadPackageId });
  } catch (error) {
    return NextResponse.error(error);
  }
}
