import Head from "next/head";
import styles from "styles/GeneralSettings.module.scss";
import AdminNavBar from "@/components/adminNavBar";
import {useSession, getSession} from "next-auth/react";
import Image from "next/image";
import Footer from "@/components/footer";
import {useState} from "react";
import prisma from "/prisma/client";

export default function GeneralSettings({gSettings}) {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState(gSettings.title.value);
  const [keyWords, setKeyWords] = useState(gSettings.keywords.value);
  const [description, setDescription] = useState(gSettings.description.value);
  const [instagram, setInstagram] = useState(gSettings.instagram.value);
  const [facebook, setFacebook] = useState(gSettings.facebook.value);
  const [twitter, setTwitter] = useState(gSettings.twitter.value);
  const [youtube, setYoutube] = useState(gSettings.youtube.value);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleKeyWordsChange = (e) => {
    setKeyWords(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleInstagramChange = (e) => {
    setInstagram(e.target.value);
  }

  const handleFacebookChange = (e) => {
    setFacebook(e.target.value);
  }

  const handleTwitterChange = (e) => {
    setTwitter(e.target.value);
  }

  const handleYoutubeChange = (e) => {
    setYoutube(e.target.value);
  }

  let data = {
    title,
    description,
    keyWords,
    instagram,
    facebook,
    twitter,
    youtube
  }

  const saveData = async (e) => {
    e.preventDefault();

    await fetch('/api/admin/generalSettings', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => {
      if(res.status === 200) {
        setError(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(true);
      }
    })

    console.log(data);
  }

  if(session && status === "authenticated") {
    return (
      <>
        <Head>
          <title>General settings</title>
        </Head>
        <div className={styles.generalSettings}>
          <AdminNavBar/>
          <div className={`container ${styles.container}`}>
            <form className={styles.settings} onSubmit={saveData}>
              <div className={styles.head}>
                <Image src="/img/admin/gsettings.svg" width="60" height="57" alt="settings icon" />
                <h2>General settings</h2>
              </div>
              {success ? <p className={styles.success}>Saved!</p> : null}
              {error ? <p className={styles.error}>ERR: check the console</p> : null}
              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.item}>
                    <label htmlFor="title">Website title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="ex. andreibancos.com"
                      value={title}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>
                  <div className={styles.item}>
                    <label htmlFor="keywords">Website keywords</label>
                    <input
                      type="text"
                      id="keywords"
                      placeholder="gallery, web, app, photos, images"
                      value={keyWords}
                      onChange={handleKeyWordsChange}
                      required
                    />
                  </div>
                  <div className={styles.item}>
                    <label htmlFor="description">Website description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={handleDescriptionChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.item}>
                    <label htmlFor="instagram">Instagram link</label>
                    <input
                      type="url"
                      id="instagram"
                      placeholder="https://instagram.com"
                      value={instagram}
                      onChange={handleInstagramChange}
                      required
                    />
                  </div>
                  <div className={styles.item}>
                    <label htmlFor="facebook">Facebook link</label>
                    <input
                      type="url"
                      id="facebook"
                      placeholder="https://facebook.com"
                      value={facebook}
                      onChange={handleFacebookChange}
                      required
                    />
                  </div>
                  <div className={styles.item}>
                    <label htmlFor="twitter">Twitter link</label>
                    <input
                      type="url"
                      id="twitter"
                      placeholder="https://twitter.com"
                      value={twitter}
                      onChange={handleTwitterChange}
                      required
                    />
                  </div>
                  <div className={styles.item}>
                    <label htmlFor="youtube">Youtube link</label>
                    <input
                      type="url"
                      id="youtube"
                      placeholder="https://youtube.com"
                      value={youtube}
                      onChange={handleYoutubeChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <button type="submit">Save</button>
            </form>
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
    const title = await prisma.general_settings.findFirst({ where: { name: 'title' } })
    const description = await prisma.general_settings.findFirst({ where: { name: 'description' } })
    const keywords = await prisma.general_settings.findFirst({ where: { name: 'keyWords' } })
    const instagram = await prisma.general_settings.findFirst({ where: { name: 'instagram' } })
    const facebook = await prisma.general_settings.findFirst({ where: { name: 'facebook' } })
    const twitter = await prisma.general_settings.findFirst({ where: { name: 'twitter' } })
    const youtube = await prisma.general_settings.findFirst({ where: { name: 'youtube' } })
    return {
      props: {
        session,
        gSettings: {title, description, keywords, instagram, facebook, twitter, youtube}
      }
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