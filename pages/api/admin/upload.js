import cloudinary from '@/utils/cloudinary'
import { getServerSession } from "next-auth/next";
import prisma from "@/prisma/client";

export default async function upload(req, res) {
  const session = await getServerSession(req, res);

  if(session && session.user.email === process.env.adminEmail) {
    const data = JSON.parse(req.body);

    if(req.method === 'POST') {
      try {
        const addCollection = await prisma.collections.create({
          data: {
            name: data.name,
            description: data.description,
            slug: data.name.toLowerCase().replaceAll(' ', '-'),
          }
        });

        await data.images.map(image => {
          cloudinary.uploader.upload_large(image, {
            resource_type: "image",
            folder: `ab-gallery/${data.name}`
          }).then(async (res) => {
            const addImages = await prisma.images.create({
              data: {
                publicId: res.public_id,
                link: res.secure_url,
                collectionsId: addCollection.id
              }
            });
            console.log(res.public_id + " - uploaded!");
          }).catch((e) => {
            console.log(e);
          });
        });
        res.status(200).send();
      } catch (e) {
        console.log('Upload Api error. ' + e.message);
        res.status(500).send();
      }
    }
    if(req.method === 'PUT') {
      try {
        await cloudinary.uploader.upload_large(data.image, {
          resource_type: "image",
          folder: `ab-gallery/${data.name}`
        }).then(async (res) => {
          const addImage = await prisma.images.create({
            data: {
              publicId: res.public_id,
              link: res.secure_url,
              collectionsId: data.id
            }
          });
          console.log(res.public_id + " - uploaded!");
        }).catch((e) => {
          console.log(e);
        });
        res.status(200).send();
      } catch (e) {
        console.log('Upload Api error. ' + e.message);
        res.status(500).send();
      }
    }
  } else {
    res.status(401).send("You not have permission to use this api.");
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb'
    }
  }
}