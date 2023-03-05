import {getSession} from "next-auth/react";
import prisma from "/prisma/client";

export default async function handler(req, res) {
  const session = await getSession({req});
  if(req.method === "POST" && session && session.user.email === process.env.adminEmail) {
    const data = JSON.parse(req.body);
    try {
      const createData = await prisma.general_settings.createMany({
        data: [
          {name: 'title', value: data.title},
          {name: 'description', value: data.description},
          {name: 'keyWords', value: data.keyWords},
          {name: 'instagram', value: data.instagram},
          {name: 'facebook', value: data.facebook},
          {name: 'twitter', value: data.twitter},
          {name: 'youtube', value: data.youtube},
        ],
        skipDuplicates: true
      })
      if(createData.count === 0) {
        const updateTitle = await prisma.general_settings.update({
          where: { name: 'title' }, data: {value: data.title}
        })
        const updateDesc = await prisma.general_settings.update({
          where: { name: 'description' }, data: {value: data.description}
        })
        const updateKeyWords = await prisma.general_settings.update({
          where: { name: 'keyWords' }, data: {value: data.keyWords}
        })
        const updateIG = await prisma.general_settings.update({
          where: { name: 'instagram' }, data: {value: data.instagram}
        })
        const updateFB = await prisma.general_settings.update({
          where: { name: 'facebook' }, data: {value: data.facebook}
        })
        const updateTwitter = await prisma.general_settings.update({
          where: { name: 'twitter' }, data: {value: data.twitter}
        })
        const updateYT = await prisma.general_settings.update({
          where: { name: 'youtube' }, data: {value: data.youtube}
        })
      }
      res.status(200);
      res.send();
    } catch (e) {
      console.log('Error generalSettings Api: ' + e.message);
      res.status(500);
      res.send();
    }
  } else {
    res.status(401).send("You not have permission to use this api.");
  }
}