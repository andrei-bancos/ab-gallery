import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.css';
import { Open_Sans } from "@next/font/google";

const website_font = Open_Sans({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html, body, form, input, button, textarea {
          font-family: ${website_font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}