import Head from "next/head";
import {getSession, useSession} from "next-auth/react";
import AdminNavBar from "@/components/adminNavBar";
import Footer from "@/components/footer";
import styles from "/styles/AdminContact.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import {useState} from "react";
import prisma from "@/prisma/client";
import {useRouter} from "next/router";

export default function Contact({contactMessages}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openMsg, setOpenMsg] = useState();

  const deleteMessage = async (id) => {
    await fetch('/api/admin/deleteContactMsg', {
      method: 'DELETE',
      body: id
    }).then((res) => {
      if(res.status === 200) {
        router.replace(router.asPath);
      }
    });
  }

  if(session && status === "authenticated") {
    return(
      <>
        <Head>
          <title>Contact messages</title>
        </Head>
        <div className={styles.contact}>
          <AdminNavBar />
          <div className={`container ${styles.container}`}>
            <div className={styles.messages}>
              <div className={styles.head}>
                <Image src="/img/admin/messages.svg" width="60" height="60" alt="collections" />
                <h2>Contact messages ({contactMessages.length})</h2>
              </div>
              <div className={styles.content}>
                {
                  contactMessages.map(msg => {
                    return(
                      <div key={msg.id} className={styles.message}>
                        <div className={styles.top}>
                          <div className={styles.left} onClick={() => {setOpenMsg(msg.id)}}>
                            <h3>{msg.fullName}</h3>
                            <p>{msg.email}</p>
                          </div>
                          <button onClick={() => deleteMessage(msg.id)}>Delete</button>
                        </div>
                        {openMsg === msg.id ?
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, type: "spring"}}
                            className={styles.msg}
                          >
                            <h3>Subject: <span>{msg.subject}</span></h3>
                            <h3>Message:</h3>
                            <p>{msg.message}</p>
                          </motion.div>
                        : null}
                      </div>
                      )
                  })
                }
                {
                  contactMessages.length === 0 ?
                    <div className={styles.noMessages}>
                      <h3>You have no messages to read</h3>
                    </div>
                  : null
                }
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export async function getServerSideProps({req}) {
  const session = await getSession({req});

  if(!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }

  if(session && session.user.email === process.env.adminEmail) {
    const contactMessages = await prisma.contact.findMany({orderBy:{id: 'desc'}});
    return {
      props: { session, contactMessages }
    }
  } else {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }
}