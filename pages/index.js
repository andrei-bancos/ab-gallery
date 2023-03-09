import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.scss'
import Header from "@/components/header";
import Footer from "@/components/footer";
import prisma from "@/prisma/client";

export default function Home({websiteTitle, websiteDescription, websiteKeywords}) {
  return (
    <>
      <Head>
        <title>{websiteTitle ? websiteTitle.value : 'AB - Gallery'}</title>
        <meta name="description" content={websiteDescription ? websiteDescription.value : ''} />
        <meta name="keywords" content={websiteKeywords ? websiteKeywords.value : ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container">
        <div className={styles.lastCollections}>
          <h2 className={styles.catTitle}>Last 3 collections added</h2>
          <div className={styles.collections}>
            <div className={styles.collection}>
              <h3>Title collection</h3>
              <div className={styles.hiddenInfo}>
                <span className={styles.imageCount}>(7 images)</span>
                <div className={styles.info}>
                  <p>Photos in bratislava, a modern city and capital of Slovakia. See my last summer in photos :)</p>
                  <button>See the pictures</button>
                </div>
              </div>
            </div>
            <div className={styles.collection}>
              <h3>Title collection</h3>
            </div>
            <div className={styles.collection}>
              <h3>Title collection</h3>
            </div>
          </div>
        </div>
        <div className={styles.lastPhotos}>
          <h2 className={styles.catTitle}>Last photos added</h2>
          <div className="row" style={{display: "flex", alignItems: "center"}}>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="1080" height="1440" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
            <div className="col-md-4 mt-3 col-lg-4">
              <Image className={styles.image} src="/headerBG.jpg" width="300" height="300" alt="" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  try {
    const websiteTitle = await prisma.generalSettings.findFirst({where: {name: 'title'}})
    const websiteDescription = await prisma.generalSettings.findFirst({where: {name: 'descrsiption'}})
    const websiteKeywords = await prisma.generalSettings.findFirst({where: {name: 'keysWords'}})
    return {
      props: {websiteTitle, websiteDescription, websiteKeywords}
    }
  } catch (e) {
    console.log(e.message)
  }
}