import styles from '../styles/landing.module.css';

function Landing() {
    return(
         <div className={styles.sectionDiv}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>Sua carga, nossa prioridade.</h1>
            <h2 className={styles.subtitle}>
              Mais do que uma transportadora, somos o parceiro logístico 
              que sua empresa precisa para crescer. Entregas em toda 
              região central de Minas Gerais com a agilidade que o 
              seu negócio exige.
            </h2>
          </div>
        </div>
    )
}

export default Landing;