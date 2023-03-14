import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import prisma from "@/prisma/client";
import styles from "@/styles/Collections.module.scss";
import {motion} from "framer-motion";
import {useState} from "react";
import {useRouter} from "next/router";

export default function Collections({collections}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return(
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Header headerHeight={350} headerText={<h1 style={{fontSize: '35px', color: '#fff'} }>Collections ({collections.length})</h1>} />
      <div className="container">
        <div className={styles.collections}>
          {
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
                        <button onClick={() => router.push('/collection/' + collection.slug)}>See the pictures</button>
                      </div>
                    </motion.div>
                    : null}
                </div>
              )
            })
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  try {
    const collections = await prisma.collections.findMany({orderBy: {id: 'desc'}, include: {images: true}});
    return { props: { collections } }
  } catch (e) {
    console.log(e.message);
  }
}