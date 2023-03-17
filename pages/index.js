import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.scss'
import Header from "@/components/header";
import Footer from "@/components/footer";
import prisma from "@/prisma/client";
import { motion } from "framer-motion";
import {useState} from "react";
import {useRouter} from "next/router";

export default function Home({websiteTitle, websiteDescription, websiteKeywords, images, collections}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Head>
        <title>{websiteTitle ? websiteTitle.value : 'AB - Gallery'}</title>
        <meta name="description" content={websiteDescription ? websiteDescription.value : ''} />
        <meta name="keywords" content={websiteKeywords ? websiteKeywords.value : ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header headerText={<h1>Welcome to my photos <span style={{color: "#fff", textTransform: "uppercase"}}>gallery</span></h1>}/>
      <div className="container">
        <div className={styles.lastCollections}>
          <h2 className={styles.catTitle}>Last 3 collections added</h2>
          <div className={styles.collections}>
            { collections.length !== 0 ?
              collections.map((collection, idx) => {
                const backgroundImg = `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.45)),
                url('https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/c_scale,w_1320/${collection.images[0].publicId}')`;
                return (
                  <div
                    key={idx}
                    className={styles.collection}
                    style={{background: backgroundImg, cursor: open === idx ? "default" : "pointer"}}
                    onClick={() => {setOpen(idx)}}
                  >
                    <h3>{collection.name}</h3>
                    {open === idx ?
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, type: "spring"}}
                        className={styles.hiddenInfo}
                      >
                        <span className={styles.imageCount}>({collection.images.length} images)</span>
                        <div className={styles.info}>
                          <p>{collection.description}</p>
                          <button onClick={() => router.push('/collection/' + collection.slug)}>See the photos</button>
                        </div>
                      </motion.div>
                    : null}
                  </div>
                )
              }) : <p className={styles.infoMSG}>Not found</p>
            }
          </div>
        </div>
        <div className={styles.lastPhotos}>
          <h2 className={styles.catTitle}>Last photos added</h2>
          <div className="row" style={{display: "flex", alignItems: "center"}}>
            { images.length !== 0 ?
              images.map(img => {
                return(
                  <motion.div key={img.id} className="col-md-4 mt-3 col-lg-4"
                              initial={{opacity: 0}}
                              whileInView={{opacity: 1}}
                              transition={{duration: 1, type: 'spring', bounce: 0.3}}
                              viewport={{ once: true, amount: 0.3 }}>
                    <Image
                      className={styles.image}
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/c_scale,w_720/${img.publicId}`}
                      width="416"
                      height="312"
                      alt=""
                    />
                  </motion.div>
                )
              }) : <div className="col"><p className={styles.infoMSG}>Not found</p></div>
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  try {
    const websiteTitle = await prisma.generalSettings.findFirst({where: {name: 'title'}});
    const websiteDescription = await prisma.generalSettings.findFirst({where: {name: 'descrsiption'}});
    const websiteKeywords = await prisma.generalSettings.findFirst({where: {name: 'keysWords'}});
    const collections = await prisma.collections.findMany({
      take: 3,
      include: {images: true},
      orderBy: {
        id: 'desc'
      }
    });
    const images = await prisma.images.findMany({
      take: 9,
      orderBy: {
        id: 'desc'
      }
    });
    return {
      props: {websiteTitle, websiteDescription, websiteKeywords, images, collections}
    }
  } catch (e) {
    console.log(e.message);
  }
}