import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "/styles/Contact.module.scss";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/prisma/client";
import {useState} from "react";

export default function Contact({instagram, facebook, twitter, youtube}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendBtnMsg, setSendBtnMsg] = useState('Send');

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  let data = {
    name,
    email,
    subject,
    message
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    setSendBtnMsg('Waiting..');
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((res) => {
      if(res.status === 200) {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSendBtnMsg('Sent!');
        setTimeout(() => setSendBtnMsg('Send'), 3000);
      } else {
        setTimeout(() => setSendBtnMsg('Error'), 5000);
      }
    })
  }
  return (
    <>
      <Head>
        <title>Contact</title>
      </Head>
      <Header headerHeight={300} />
      <div className="container">
        <div className={styles.contact}>
          <form onSubmit={sendMessage}>
            <div className={styles.head}>
              <h1>Contact</h1>
              <p>If you want contact us use below form.</p>
            </div>
            <input type="text" placeholder="Full name" value={name} onChange={handleNameChange} required/>
            <input type="email" placeholder="Email address" value={email} onChange={handleEmailChange} required/>
            <input type="text" placeholder="Subject" value={subject} onChange={handleSubjectChange} required/>
            <textarea placeholder="Message.." value={message} onChange={handleMessageChange} required></textarea>
            <button type="submit" className={styles.sendBTN}>{sendBtnMsg}</button>
          </form>
          <span>OR</span>
          <div className={styles.socialMedia}>
            <h3>Contact my on social media accounts</h3>
            <div className={styles.links}>
              <Link href={instagram != null ? instagram.value : ""} target="_blank">
                <Image src="/img/social-media/instagram.svg" width="50" height="50" alt="Instagram" />
              </Link>
              <Link href={facebook != null ? facebook.value : ""} target="_blank">
                <Image src="/img/social-media/facebook.svg" width="50" height="50" alt="Facebook" />
              </Link>
              <Link href={twitter != null ? twitter.value : ""} target="_blank">
                <Image src="/img/social-media/twitter.svg" width="50" height="42" alt="Twitter" />
              </Link>
              <Link href={youtube != null ? youtube.value : ""} target="_blank">
                <Image src="/img/social-media/youtube.svg" width="50" height="36" alt="Youtube" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  try {
    const instagram = await prisma.generalSettings.findFirst({where: {name: 'instagram'}});
    const facebook = await prisma.generalSettings.findFirst({where: {name: 'facebook'}});
    const twitter = await prisma.generalSettings.findFirst({where: {name: 'twitter'}});
    const youtube = await prisma.generalSettings.findFirst({where: {name: 'youtube'}});

    return {props: {instagram, facebook, twitter, youtube}}
  } catch (e) {
    console.log(e.message);
  }
}