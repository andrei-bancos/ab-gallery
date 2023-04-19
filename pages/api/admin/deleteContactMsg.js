import { getServerSession } from "next-auth/next";
import prisma from "@/prisma/client";

export default async function deleteContactMsg(req, res) {
  const session = await getServerSession(req, res);
  if(req.method === "DELETE" && session && session.user.email === process.env.adminEmail) {
    const msgId = parseInt(req.body);
    try {
      const deleteMsg = await prisma.contact.delete({where: {id: msgId}});
      res.status(200).send();
    } catch (e) {
      console.log('DeleteContactMsg api error: ' + e.message);
      res.status(500).send();
    }
  } else {
    res.status(401).send("You not have permission to use this api.");
  }
}