import prisma from "@/prisma/client";

export default async function contact(req, res) {
  if(req.method === "POST") {
    const data = JSON.parse(req.body);
    try {
      const addContactMessage = await prisma.contact.create({
        data: {
          fullName: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        }
      })
      res.status(200).send();
    } catch (e) {
      console.log('Contact api error: ' + e.message);
      res.status(500).send();
    }
  } else {
    return null;
  }
}