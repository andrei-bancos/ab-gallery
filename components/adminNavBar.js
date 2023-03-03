import styles from "@/styles/AdminNavbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import {useSession, signOut} from "next-auth/react";

export default function AdminNavBar() {
  const {data: session} = useSession();
  return (
    <nav className={styles.navbar}>
      <div className="container">
        <ul>
          <li className={styles.left}>
            <Link href="/admin"><Image src="/logo.svg" width="75" height="75" alt="logo" /></Link>
            <h1>Admin panel</h1>
          </li>
          <li className={styles.right}>
            <Image src={session.user.image} width="65" height="65" alt="avatar" />
            <div className={styles.user}>
              <h2>{session.user.name}</h2>
              <p>{session.user.email}</p>
            </div>
            <button className={styles.logoutBTN} onClick={() => signOut()}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}