import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const goTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
  return (
    <footer>
      <div className="container footer">
        <div className="left">
          <p>Copyright © websitename.com</p>
          <p className="created">
            Created by <Link href="https://andreibancos.com" target="_blank">andreibancos.com</Link>
          </p>
        </div>
        <Image src="/top.svg" width="80" height="80" alt="go top" onClick={() => goTop()} />
      </div>
    </footer>
  )
}