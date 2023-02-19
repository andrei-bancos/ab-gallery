import Link from "next/link";
import Image from "next/image";
import styles from "/styles/Header.module.scss";
import {useRouter} from "next/router";
import {useState} from "react";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menu = () => {
    document.getElementById(styles.menu).style.display = isOpen ? "block" : "none";
    document.getElementById(styles.desktop).style.display = isOpen ? "none" : "none";
    document.getElementById(styles.navbarMobile).style.display = isOpen ? "none" : "flex";
    document.getElementById(styles.close).style.display = isOpen ? "none" : "flex";
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div className={styles.header}>
        <div className={`container ${styles.hContainer}`}>
          <nav id={styles.navbarMobile}>
            <ul>
              <li><Link href="/" className={router.pathname === "/" ? styles.active : ""}>Home</Link></li>
              <li><Link href="/" className={router.pathname === "/collections" ? styles.active : ""}>Collections</Link></li>
              <li><Link href="/" className={router.pathname === "/contact" ? styles.active : ""}>Contact</Link></li>
            </ul>
          </nav>
          <nav className={styles.navbar}>
            <Link href="/">
              <Image src="/logo.svg" alt="" width="65" height="65" />
            </Link>
            <ul id={styles.desktop}>
              <li><Link href="/" className={router.pathname === "/" ? styles.active : ""}>Home</Link></li>
              <li><Link href="/" className={router.pathname === "/collections" ? styles.active : ""}>Collections</Link></li>
              <li><Link href="/" className={router.pathname === "/contact" ? styles.active : ""}>Contact</Link></li>
            </ul>
            <Image id={styles.menu}
                   src="/menu.svg"
                   width="61"
                   height="60"
                   alt="menu"
                   onClick={() => menu()}
            />
            <Image id={styles.close}
                   src="/close.svg"
                   width="58"
                   height="58"
                   alt="menu"
                   onClick={() => menu()}
            />
          </nav>
          <div className={styles.text}>
            <h1>Welcome to my photos <span style={{color: "#fff", textTransform: "uppercase"}}>gallery</span></h1>
          </div>
        </div>
      </div>
    </>
  )
}