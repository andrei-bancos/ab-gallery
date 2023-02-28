import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#111111" />
        <link rel="icon" sizes="64x64" href="/favicon/favicon-64x64.png" />
        <link rel="icon" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/favicon/favicon192.png" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
