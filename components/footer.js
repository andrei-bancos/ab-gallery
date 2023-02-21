import Image from "next/image";

export default function Footer() {
  const goTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
  return (
    <footer>
      <div className="container footer">
        <p>Copyright © websitename.com</p>
        <Image src="/top.svg" width="80" height="80" alt="go top" onClick={() => goTop()} />
      </div>
    </footer>
  )
}