import Head from "next/head";
import AdminNavBar from "@/components/adminNavBar";
import Footer from "@/components/footer";
import {getSession, useSession} from "next-auth/react";
import styles from "/styles/Add.module.scss";
import Image from "next/image";
import {useState} from "react";

export default function Add() {
  const { data: session, status } = useSession();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlerNameChange = (e) => {
    setName(e.target.value);
  }

  const handlerDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handlerImagesChange = (e) => {
    const fileTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    for (const file of e.target.files) {
      let checkExt = file.name.split('.').pop().toLowerCase();
      let isSuccess = fileTypes.indexOf(checkExt) > -1;
      if(isSuccess) {
        if(file.size > 10485760) {
          setError(file.name + ' - too big..');
          setTimeout(() => setError(''), 3000);
          continue;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImages((imgs) => [...imgs, reader.result]);
        };
        reader.onerror = () => {
          console.log(reader.error);
        };
      } else {
        setError(file.name + ' - is not a image');
        setTimeout(() => setError(''), 3000);
      }
    }
  }

  const addCollection = async (e) => {
    e.preventDefault();
    let data = {
      name,
      description,
      images
    }

    if(data.name.length < 3) {
      setError('Name is to short');
    } else {
      setError('');
      if(data.description.length < 10) {
        setError('Description is to short');
      } else {
        setError('');
        if(data.images.length === 0) {
          setError('Add images...');
        } else {
          setError('');
          fetch('/api/admin/upload', {
            body: JSON.stringify(data),
            method: "POST"
          }).then(() => {
            setName('');
            setDescription('');
            setImages([]);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
          })
        }
      }
    }
  }

  if(session && status === "authenticated") {
    return(
      <>
        <Head>
          <title>Add</title>
        </Head>
        <div className={styles.addCollection}>
          <AdminNavBar />
          <div className={`container ${styles.container}`}>
            <form className={styles.add} onSubmit={addCollection}>
              <div className={styles.head}>
                <Image src="/img/admin/add.svg" width="60" height="60" alt="add" />
                <h2>Add collection</h2>
              </div>
              {success ? <p className={styles.success}>The collection has been added</p> : null}
              {error ? <p className={styles.error}>{error}</p> : null}
              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.item}>
                    <label htmlFor="name">Collection name</label>
                    <input id="name" type="text" value={name} onChange={handlerNameChange} required />
                  </div>
                  <div className={styles.item}>
                    <label htmlFor="description">Collection description</label>
                    <textarea id="description" value={description} onChange={handlerDescriptionChange} required />
                  </div>
                </div>
                <div className={styles.col}>
                  <label className={styles.addImages} htmlFor="images">
                    <Image src="/img/admin/add-images.svg"  width="60" height="60" alt="" />
                    <span>Click here to add images</span>
                    <input id="images" type="file" accept="image/*" multiple onChange={handlerImagesChange} />
                  </label>
                  <p className={styles.size}>(Max size per image 10MB)</p>
                  <div className={styles.selectedImages} style={{display: images.length !== 0 ? "block" : "none"}}>
                    <h5 className={styles.title}>Selected images:</h5>
                    <div className={styles.images}>
                      {images.map((image, id) => {
                        return(
                          <Image key={id}  src={image} width="50" height="50" alt=""></Image>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <button className={styles.addBTN} type="submit">Add</button>
            </form>
          </div>
          <Footer />
        </div>
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
    return {
      props: { session }
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