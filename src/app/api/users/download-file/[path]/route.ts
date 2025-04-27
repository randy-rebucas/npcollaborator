import { NextResponse } from "next/server";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//     region: process.env.AWS_REGION!,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
// });

// async function getFile(path: string) {
//     const command = new GetObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME!,
//         Key: path,
//     });
//     return await s3Client.send(command);
// }

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string }> }
) {
    const { path } = await params;
    console.log(`path: ${path}`);
    // const file = await getFile(path);
    return NextResponse.json({ path });
}