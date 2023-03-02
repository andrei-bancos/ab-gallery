import styles from "@/styles/AdminNavbar.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function AdminNavBar() {
  return (
    <nav className={styles.navbar}>
      <div className="container">
        <ul>
          <li className={styles.left}>
            <Link href="/admin"><Image src="/logo.svg" width="75" height="75" alt="logo" /></Link>
            <h1>Admin panel</h1>
          </li>
          <li className={styles.right}>
            <Image src="/gg" width="65" height="65" alt="avatar" />
            <div className={styles.user}>
              <h2>Bancos Andrei Marius</h2>
              <p>bancos.andrei.2002@gmail.com</p>
            </div>
            <button className={styles.logoutBTN}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}