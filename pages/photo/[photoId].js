import Head from "next/head";
import Image from "next/image";
import prisma from "@/prisma/client";
import styles from "/styles/Photo.module.scss";
import {useRouter} from "next/router";

export default function PhotoId({img}) {
  const router = useRouter();
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
          <Image
            className={styles.image}
            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/c_scale,w_2560/${img.publicId}`}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkWAAAAKYAoqSjxZIAAAAASUVORK5CYII="
            placeholder="blur"
            width={1280}
            height={960}
            alt=""
          />
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