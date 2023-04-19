import cloudinary from '/utils/cloudinary';
import { getServerSession } from "next-auth/next";
import prisma from "/prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if(req.method === "DELETE" && session && session.user.email === process.env.adminEmail) {
    const data = JSON.parse(req.body);
    try {
      const deleteImagesDB = await prisma.images.deleteMany({ where: {collectionsId: data.id}});
      if(data.imgIds.length > 0) {
        const deleteImagesCloud = await cloudinary.api.delete_resources(data.imgIds);
        const deleteFolderCloud = await cloudinary.api.delete_folder("ab-gallery/" + data.name);
      }
      const deleteCollectionDB = await prisma.collections.delete({ where: {id: data.id} })
      res.status(200);
      res.send();
    } catch (e) {
      console.log('Error delete-collection Api: ' + e.message);
      res.status(500);
      res.send();
    }
  } else {
    res.status(401).send("You not have permission to use this api.");
  }
}
