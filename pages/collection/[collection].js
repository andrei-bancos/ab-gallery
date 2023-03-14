import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import prisma from "@/prisma/client";
import {motion} from "framer-motion";
import Image from "next/image";
import styles from "@/styles/Collection.module.scss";

export default function Collection({collection}) {
  return(
    <>
      <Head>
        <title>{collection.name}</title>
      </Head>
      <Header
        headerHeight={550}
        headerText={
          <>
            <h1 style={{fontSize: '35px'}}>Collection - <span>{collection.name}</span></h1>
            <h3>({collection.images.length} images)</h3>
            <p>{collection.description}</p>
          </>
        }
      />
      <div className="container">
        <div className={`row d-flex align-items-center ${styles.images}`}>
          {
            collection.images.map(img => {
              return(
                <motion.div key={img.id} className="col-md-4 mt-3 col-lg-4"
                            initial={{opacity: 0}}
                            whileInView={{opacity: 1}}
                            transition={{duration: 1, type: 'spring', bounce: 0.3}}
                            viewport={{ once: true, amount: 0.3 }}>
                  <Image
                    className={styles.image}
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/c_scale,w_416/${img.publicId}`}
                    width="416"
                    height="312"
                    alt=""
                  />
                </motion.div>
              )
            })
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps({query}) {
  const slug = query.collection;

  try {
    const collection = await prisma.collections.findFirst({where: {slug: slug}, include: {images: {orderBy: {id: "desc"}}}});

    if(collection === null || collection.slug !== slug) {
      return {
        notFound: true
      }
    }

    return {props: {collection}}
  } catch (e) {
    console.log(e.message);
  }
}