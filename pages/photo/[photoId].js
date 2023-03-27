import Head from "next/head";
import Image from "next/image";
import prisma from "@/prisma/client";
import styles from "/styles/Photo.module.scss";
import {useRouter} from "next/router";
import {useState} from "react";
import {motion} from "framer-motion";

export default function PhotoId({img}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  return(
    <>
      <Head>
        <title>Image</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.photo}>
          <div className={styles.actions}>
            <button className={styles.backBtn} onClick={() => router.back()}>back</button>
            <Image
              className={styles.linkImg}
              src='/img/link-img.svg'
              width="50"
              height="50"
              alt=""
              priority={true}
              onClick={() => router.push(img.link)}
            />
          </div>
          {isLoading ? <motion.span initial={{opacity: 0}} animate={{opacity: 1}} className='loader'></motion.span> : null}
          <motion.div initial={{opacity: 0}} animate={{opacity: isLoading ? 0 : 1}} transition={{duration: 0.5}}>
            <Image
              className={styles.image}
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/c_scale,w_2560/${img.publicId}`}
              width={1280}
              height={960}
              alt=""
              onLoadingComplete={() => setIsLoading(false)}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({query}) {
  const id = query.photoId;
  const img = await prisma.images.findFirst({where: {id: parseInt(id)}})
  return {
    props: {img}
  }
}