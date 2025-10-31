import styles from '../styles/who-we-are.module.css';

import WhoWeAreImg from '../assets/whoeweare.jpg'; 

function WhoWeAre() {
  return (
    <section className={styles.whoWeAreSection}>
      <div className={styles.imageContainer}>
        <img src={WhoWeAreImg} alt="Equipe Transportes Linhares em reunião" className={styles.image} />
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Quem Somos</h2>
        <p className={styles.text}>
          Há mais de 22 anos, a <strong>Transportes Linhares</strong> é sinônimo de transporte de cargas com segurança e agilidade.
        </p>
        <p className={styles.text}>
          Somos especialistas em logística integrada, conectando dezenas de municípios na região central de Minas Gerais para garantir que sua entrega chegue no prazo, com a confiança que seu negócio merece.
        </p>
      </div>
    </section>
  );
}

export default WhoWeAre;