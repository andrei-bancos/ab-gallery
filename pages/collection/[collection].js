import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import prisma from "@/prisma/client";
import Photos from "@/components/photos";

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
        <Photos content={collection.images} />
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