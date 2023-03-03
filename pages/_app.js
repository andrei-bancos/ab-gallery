import 'bootstrap/dist/css/bootstrap-grid.css';
import '@/styles/globals.scss';
import { Open_Sans } from "@next/font/google";
import {SessionProvider} from "next-auth/react";

const website_font = Open_Sans({ subsets: ['latin'] });

export default function App({ Component, pageProps, session }) {
  return (
    <>
      <SessionProvider session={session}>
        <style jsx global>{`
          html, body, form, input, button, textarea {
            font-family: ${website_font.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}