import { FaSitemap, FaTags, FaTruckMoving, FaUsers } from "react-icons/fa";
import valuesImage from "../assets/values.jpg"; 
import styles from '../styles/values.module.css';


function Values() {
    return (
        <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitleFeatures}>
                Compromisso em cada detalhe,
                <strong className={styles.highlight}>da cotação ao destino final.</strong>
            </h2>

            <div className={styles.featuresContent}>

                <div className={styles.featuresImage}>
                    <img 
                      src={valuesImage} 
                      alt="Equipe de logística trabalhando" 
                      className={styles.image} 
                    />
                </div>

                <div className={styles.featuresGrid}>

                    <div className={`${styles.featureCard} ${styles.featureCardPrimary}`}>
                        <FaUsers className={styles.icon} />
                        Atendimento Especializado
                    </div>

                    <div className={`${styles.featureCard} ${styles.featureCardSecondary}`}>
                        <FaTruckMoving className={styles.icon} />
                        Motoristas capacitados
                    </div>

                    <div className={`${styles.featureCard} ${styles.featureCardSecondary}`}>
                        <FaSitemap className={styles.icon} />
                        Plano de logística personalizado
                    </div>

                    <div className={`${styles.featureCard} ${styles.featureCardPrimary}`}>
                        <FaTags className={styles.icon} />
                        Atendimento exclusivo
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Values;