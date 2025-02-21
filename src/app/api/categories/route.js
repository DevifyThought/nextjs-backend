import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import { corsMiddleware } from "@/lib/corsMiddleware";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find({});
    return Response.json(categories, corsMiddleware());
  } catch (error) {
    return Response.json({ error: "Failed to fetch categories" }, { status: 500, ...corsMiddleware() });
  }
}

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { name, status, image } = await req.json();
//     if (!name || !image) {
//       return Response.json({ error: "Name and image are required" }, { status: 400, ...corsMiddleware() });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(image, {
//       folder: "categories",
//     });

//     const newCategory = await Category.create({
//       name,
//       status,
//       imageUrl: uploadResponse.secure_url,
//       imagePublicId: uploadResponse.public_id,
//     });

//     return Response.json(newCategory, { status: 201, ...corsMiddleware() });
//   } catch (error) {
//     console.log(error);
//     return Response.json({ error: "Failed to create category" }, { status: 500, ...corsMiddleware() });
//   }
// }


export async function POST(req) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const status = formData.get("status")
    const image = formData.get("image");

    if (!name || !image) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${image.type};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "categories",
    });

    const newCategory = await Category.create({
      name,
      status,
      imageUrl: uploadResponse.secure_url,
      imagePublicId: uploadResponse.public_id,
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}


export async function OPTIONS() {
  return Response.json({}, { status: 200, ...corsMiddleware() });
}
