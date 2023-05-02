import styles from "/styles/Photos.module.scss";
import {motion} from "framer-motion";
import Image from "next/image";
import {useRouter} from "next/router";
import Masonry from "react-masonry-css";

export default function Photos({content}) {
    const router = useRouter();
    const breakPoints = {
        default: 3,
        1100: 2,
        700: 1
    }
    return (
        <>
            <Masonry
                className={styles.photos}
                breakpointCols={breakPoints}
                columnClassName={styles.col}
            >
                { content.length !== 0 ?
                    content.map(img => {
                        return(
                            <motion.div key={img.id}
                                        className={styles.item}
                                        initial={{opacity: 0}}
                                        whileInView={{opacity: 1}}
                                        transition={{duration: 1, type: 'spring', bounce: 0.3}}
                                        viewport={{ once: true, amount: 0.3 }}>
                                <Image
                                    className={styles.image}
                                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/c_scale,w_720/${img.publicId}.` + img.extension}
                                    width="416"
                                    height="312"
                                    alt=""
                                    onClick={() => router.push('/photo/' + img.id)}
                                />
                            </motion.div>
                        )
                    }) :<p className={styles.infoMSG}>Not found</p>
                }
            </Masonry>
        </>
    )
}