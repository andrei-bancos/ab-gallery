import {getProviders, useSession, signIn} from "next-auth/react";
import styles from "/styles/Login.module.scss";
import Head from "next/head";
export default function Login({providers}) {
  const { data: session, status } = useSession();
  if(!session && status !== "authenticated") {
    return (
      <>
        <Head>
          <title>Login</title>
        </Head>
        <div className={styles.login}>
          <div className={styles.content}>
            <h1><span>Login</span> page</h1>
            {
              Object.values(providers).map((provider) => (
                <div className={styles.providers} key={provider.name}>
                  <button onClick={() => signIn(provider.id)}>
                    Sign in with {provider.name}
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </>
    )
  } else {
    window.location.href = "/";
  }
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}