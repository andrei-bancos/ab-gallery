import Head from "next/head";
import AdminNavBar from "@/components/adminNavBar";
import styles from "/styles/Admin.module.scss";
import Image from "next/image";
import Footer from "@/components/footer";

export default function AdminIndex() {
  return (
    <>
      <Head>
        <title>Admin panel</title>
      </Head>
      <div className={styles.admin}>
        <AdminNavBar />
        <div className={`container ${styles.container}`}>
          <div className={styles.generalSettings}>
            <Image src="/img/admin/gsettings.svg" width="60" height="56" alt="general settings" />
            <h3>General settings</h3>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <Image src="/img/admin/add.svg" width="150" height="150" alt="add" />
              <h3>Add new collections</h3>
            </div>
            <div className={styles.col}>
              <Image src="/img/admin/collections.svg" width="150" height="150" alt="add" />
              <h3>Add new collections</h3>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}