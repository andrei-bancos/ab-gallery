import Head from "next/head";
import styles from "/styles/EditCollection.module.scss";
import AdminNavBar from "@/components/adminNavBar";
import Footer from "@/components/footer";
import {getSession, useSession} from "next-auth/react";
import Image from "next/image";
import prisma from "@/prisma/client";
import {useState} from "react";
import {useRouter} from "next/router";

export default function EditCollection({ collection }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [btnMsg, setBtnMsg] = useState('Add image');

  const handlerNameChange = (e) => {
    setName(e.target.value);
  }

  const handlerDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handlerImagesChange = async (e) => {
    const fileTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const file = e.target.files[0];
    let checkExt = file.name.split('.').pop().toLowerCase();
    let isSuccess = fileTypes.indexOf(checkExt) > -1;
    if(isSuccess) {
      if(file.size > 10485760) {
        setError(file.name + ' - too big..');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBtnMsg('Waiting..');
        addImage(reader.result);
      }
      reader.onerror = () => {
        console.log(reader.error);
      }
    } else {
      setError(file.name + ' - is not a image');
      setTimeout(() => setError(''), 3000);
    }
  }

  const addImage = async (image) => {
    let data = {
      id: collection.id,
      name: collection.name,
      image: image
    }
    // Add image
    await fetch('/api/admin/upload', {
      method: 'PUT',
      body: JSON.stringify(data)
    }).then((res) => {
      if(res.status === 200) {
        router.replace(router.asPath);
        setSuccess('Image added!');
        setBtnMsg('Add image');
        setTimeout(() => setSuccess(''), 3000);
      }
    })
  }

  const deleteCollection = async () => {
    let imgIds = [];
    collection.images.map(img => {
      imgIds.push(img.publicId);
    })
    await fetch('/api/admin/delete-collection', {
      method: 'DELETE',
      body: JSON.stringify({id: collection.id, name: collection.name, imgIds})
    }).then(() => {
      router.push('/admin/collections');
    })
  }

  const deleteImage = async (imgId) => {
    await fetch('/api/admin/delete-image', {
      method: 'DELETE',
      body: imgId
    }).then(() => {
      router.replace(router.asPath);
    })
  }

  const save = async (e) => {
    e.preventDefault();

    let data = {
      id: collection.id,
      name,
      description
    }

    await fetch('/api/admin/edit', {
      method: "PUT",
      body: JSON.stringify(data)
    }).then((res) => {
      if(res.status === 200) {
        if(collection.name !== name) {
          router.replace('/admin/collection/' + data.name.toLowerCase().replaceAll(' ', '-'));
        }
        setSuccess('Saved!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Check the console.');
      }
    })
  }

  if(session && status === "authenticated") {
    return (
      <>
        <Head>
          <title>Edit Collection</title>
        </Head>
        <div className={styles.editCollection}>
          <AdminNavBar />
            <div className={`container ${styles.container}`}>
              <form onSubmit={save} className={styles.edit}>
                <div className={styles.head}>
                  <div className={styles.left}>
                    <Image src="/img/admin/add.svg" width="60" height="60" alt="add" />
                    <h2>Edit collection</h2>
                  </div>
                  <div className={styles.right}>
                    <button type="button" className={styles.deleteBTN} onClick={() => deleteCollection(collection.id)}>Delete</button>
                  </div>
                </div>
                {success ? <p className={styles.success}>{success}</p> : null}
                {error ? <p className={styles.error}>{error}</p> : null}
                <div className={styles.row}>
                  <div className={`${styles.col} ${styles.info}`}>
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
                    <h3>Images - {collection.images.length}</h3>
                    <div className={styles.images}>
                      {
                        collection.images.map(img => {
                          return(
                            <div key={img.id} className={styles.img}>
                              <Image
                                className={styles.deleteImg}
                                src="/img/admin/close-red-img.svg"
                                width="30"
                                height="30"
                                alt=""
                                onClick={() => deleteImage(img.publicId)}
                              />
                              <Image src={img.link} width="100" height="100" alt="" />
                            </div>
                          )
                        })
                      }
                    </div>
                    <label htmlFor="addImage" className={styles.addImage}>
                      <Image src="/img/admin/add-images.svg"  width="30" height="30" alt="" />
                      <span>{btnMsg}</span>
                      <input id="addImage" type="file" accept="image/*" onChange={handlerImagesChange} />
                    </label>
                  </div>
                </div>
                <button type="submit" className={styles.saveBTN}>Save</button>
              </form>
            </div>
          <Footer />
        </div>
      </>
    )
  }
}


export async function getServerSideProps({query, req}) {
  const session = await getSession({req});
  const slug = query.editCollection;

  if(!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }

  const collection = await prisma.collections.findFirst({ where: { slug: slug }, include: {images: true} });

  if(collection === null || collection.slug !== slug) {
    return {
      notFound: true
    }
  }


  if(session && session.user.email === process.env.adminEmail) {
    return {
      props: { session, collection }
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