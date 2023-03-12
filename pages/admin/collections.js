import Head from "next/head";
import {getSession, useSession} from "next-auth/react";
import styles from "/styles/AdminCollections.module.scss";
import AdminNavBar from "@/components/adminNavBar";
import Image from "next/image";
import prisma from "@/prisma/client";
import Footer from "@/components/footer";
import {useRouter} from "next/router";

export default function Collections({ collections }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  if(session && status === "authenticated") {
    return(
      <>
        <Head>
          <title>Collections</title>
        </Head>
        <div className={styles.collections}>
          <AdminNavBar />
          <div className={`container ${styles.container}`}>
            <div className={styles.list}>
              <div className={styles.head}>
                <Image src="/img/admin/collections-icon.svg" width="60" height="60" alt="collections" />
                <h2>Collections</h2>
              </div>
              <div className={styles.content}>
                {
                  collections.map(collection => {
                    return (
                      <div key={collection.id} className={styles.collection}>
                        <h3>{collection.name}</h3>
                        <Image
                          src="/img/admin/edit-collection.svg"
                          width="40"
                          height="40"
                          alt="edit"
                          onClick={() => router.push('/admin/collection/' + collection.slug)}
                        />
                      </div>
                    )
                  })
                }
                {
                  collections.length === 0 ?
                    <div className={styles.noCollections}>
                      <h3>You have not added collections</h3>
                      <button
                        className={styles.addBTN}
                        onClick={() => router.push('/admin/add')}
                      >
                        Add collection
                      </button>
                    </div>
                  : null
                }
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export async function getServerSideProps({req}) {
  const session = await getSession({req});

  if(!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }

  if(session && session.user.email === process.env.adminEmail) {
    const collections = await prisma.collections.findMany();
    return {
      props: { session, collections }
    }
  } else {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }
}