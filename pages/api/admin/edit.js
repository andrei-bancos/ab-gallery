import { getServerSession } from "next-auth/next";
import prisma from "/prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if(req.method === "PUT" && session && session.user.email === process.env.adminEmail) {
    const data = JSON.parse(req.body);
    try {
      const update = await prisma.collections.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          slug: data.name.toLowerCase().replaceAll(' ', '-')
        }
      })
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
