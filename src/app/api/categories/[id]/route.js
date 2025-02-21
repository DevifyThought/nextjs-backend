import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import { corsMiddleware } from "@/lib/corsMiddleware";

// export async function GET(req, context) {
//   await dbConnect();
//   try {
//     const { id } = context.params; 
//     const category = await Category.findById(id);
//     if (!category) return Response.json({ error: "Category not found" }, { status: 404 });
//     return Response.json(category, corsMiddleware());
//   } catch (error) {
//     return Response.json({ error: "Invalid category ID" }, { status: 400, ...corsMiddleware() });
//   }
// }

export async function PUT(req, context) {
  await dbConnect();
  try {
    const { id } = context.params;
    const { name, status, image } = await req.json();
    const category = await Category.findById(id);
    
    if (!category) return Response.json({ error: "Category not found" }, { status: 404 });

    let updatedData = { name, status };

    if (image) {
      await cloudinary.uploader.destroy(category.imagePublicId);

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "categories",
      });

      updatedData.imageUrl = uploadResponse.secure_url;
      updatedData.imagePublicId = uploadResponse.public_id;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, { new: true });

    return Response.json(updatedCategory, corsMiddleware());
  } catch (error) {
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  try {
    const { id } = context.params; 
    const category = await Category.findById(id);
    if (!category) return Response.json({ error: "Category not found" }, { status: 404 });

    await cloudinary.uploader.destroy(category.imagePublicId);

    await Category.findByIdAndDelete(id);

    return Response.json(corsMiddleware(),{ message: "Category deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Delete failed" }, { status: 500, ...corsMiddleware() });
  }
}

export async function OPTIONS() {
  return Response.json({}, { status: 200, ...corsMiddleware() });
}