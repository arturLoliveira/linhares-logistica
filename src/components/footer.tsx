import styles from '../styles/footer.module.css';

function Footer() {
    return(
        <footer className={styles.footerContainer}>
          <h3 className={styles.footerText}>
            © Todos os direitos reservados | Transportes Linhares
          </h3>
        </footer>
    )
}

export default Footer;