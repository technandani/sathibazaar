import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Products";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET as string);
    await connectToDatabase();

    const { id, name, unitPrice, unit, availability, locationServed, image } = await request.json();
    let imageUrl = image;

    if (image && image.startsWith("data:image")) {
      const uploadResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sathibazaar_products" },
          (error, result) => (error ? reject(error) : resolve(result)),
        );
        Readable.from(Buffer.from(image.split(",")[1], "base64")).pipe(stream);
      });
      imageUrl = (uploadResponse as any).secure_url;
    }

    if (id) {
      await Product.findByIdAndUpdate(id, {
        name,
        unitPrice: Number(unitPrice),
        unit,
        availability,
        locationServed,
        image: imageUrl,
      });
      return NextResponse.json({ message: "Product updated" });
    } else {
      const product = new Product({
        supplierId: userId,
        name,
        unitPrice: Number(unitPrice),
        unit,
        availability,
        locationServed,
        image: imageUrl || `/placeholder.svg?query=${name.toLowerCase()}`,
      });
      await product.save();
      return NextResponse.json({ message: "Product added", product });
    }
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().populate("supplierId", "businessName");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET as string);
    await connectToDatabase();
    const { id } = await request.json();
    await Product.findOneAndDelete({ _id: id, supplierId: userId });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}