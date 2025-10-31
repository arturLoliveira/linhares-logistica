import { FaSitemap, FaTags, FaTruckMoving, FaUsers } from "react-icons/fa";
// 1. Importa a imagem (verifique se o caminho está correto)
import valuesImage from "../assets/values.jpg"; 
// 2. Importa o CSS Module
import styles from '../styles/values.module.css';

const linkWhatsapp = "https://wa.me/5531993751683?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20transportadora%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

function Values() {
    return (
        // 3. Aplica as classes do módulo
        <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitleFeatures}>
                Compromisso em cada detalhe,
                <strong className={styles.highlight}>da cotação ao destino final.</strong>
            </h2>

            <div className={styles.featuresContent}>

                <div className={styles.featuresImage}>
                    {/* (Use <img> ou <ImagemEquipe /> se você converteu para SVG) */}
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