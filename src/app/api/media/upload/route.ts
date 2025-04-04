import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const imgFile = fd.get("imgFile") as File;

    if (!imgFile) {
      return NextResponse.json(
        {
          message: "No file provided",
        },
        { status: 400 }
      );
    }

    if (!imgFile.type.startsWith("image/")) {
      return NextResponse.json(
        {
          message: "Invalid file type",
        },
        { status: 400 }
      );
    }

    if (imgFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          message: "File size exceeds 10MB",
        },
        { status: 400 }
      );
    }

    const fileBuffer = await imgFile.arrayBuffer();

    const mimeType = imgFile.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // this will be used to upload the file
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, "images");

    if (!res) {
      throw new Error("Error uploading image");
    }

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        url: res.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error uploading image",
      },
      { status: 500 }
    );
  }
}
