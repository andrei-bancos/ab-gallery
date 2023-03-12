import Head from "next/head";
import AdminNavBar from "@/components/adminNavBar";
import styles from "/styles/Admin.module.scss";
import Image from "next/image";
import Footer from "@/components/footer";
import {useSession, getSession} from "next-auth/react";
import {useRouter} from "next/router";

export default function AdminIndex() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if(session && status === "authenticated"){
    return (
      <>
        <Head>
          <title>Admin panel</title>
        </Head>
        <div className={styles.admin}>
          <AdminNavBar />
          <div className={`container ${styles.container}`}>
            <div className={styles.generalSettings} onClick={() => router.push("/admin/general-settings")}>
              <Image src="/img/admin/gsettings.svg" width="60" height="56" alt="general settings" />
              <h3>General settings</h3>
            </div>
            <div className={styles.row}>
              <div className={styles.col} onClick={() => router.push("/admin/add")}>
                <Image src="/img/admin/add.svg" width="150" height="150" alt="add" />
                <h3>Add new collections</h3>
              </div>
              <div className={styles.col} onClick={() => router.push("/admin/collections")}>
                <Image src="/img/admin/collections.svg" width="150" height="150" alt="add" />
                <h3>View existent collections</h3>
              </div>
            </div>
          </div>
        </div>
        <Footer />
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
    return {
      props: { session }
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