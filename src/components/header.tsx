import { FaWhatsapp } from "react-icons/fa";
import ContactButton from "./contact-button";
import styles from '../styles/header.module.css'; 
import logoDaEmpresa from '../assets/logo.png'; 

const linkWhatsapp = "https://wa.me/5531993751683?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20transportadora%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

function Header() {
    return(
        <header className={styles.headerContainer}>
          <div className={styles.headerDiv}>
            <img 
              src={logoDaEmpresa} 
              alt="Logo Transportes Linhares" 
              className={styles.logo} 
            />
            <a href={linkWhatsapp} target='_blank' className={styles.link}>
              <ContactButton
                icon={<FaWhatsapp />}
                title='Fale conosco'
              />
            </a>
          </div>
        </header>
    )
}

export default Header;