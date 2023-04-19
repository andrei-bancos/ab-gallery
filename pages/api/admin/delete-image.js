import cloudinary from '/utils/cloudinary';
import { getServerSession } from "next-auth/next"
import prisma from "/prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if(req.method === "DELETE" && session && session.user.email === process.env.adminEmail) {
    const data = req.body;
    try {
      const deleteImagesDB = await prisma.images.delete({ where: { publicId: data }});
      const deleteImagesCloud = await cloudinary.api.delete_resources(data);
      res.status(200);
      res.send();
    } catch (e) {
      console.log('Error delete-image Api: ' + e.message);
      res.status(500);
      res.send();
    }
  } else {
    res.status(401).send("You not have permission to use this api.");
  }
}
