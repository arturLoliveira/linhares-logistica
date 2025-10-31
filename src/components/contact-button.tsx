import React from 'react';
import styles from '../styles/contact-button.module.css';

interface buttonProps {
    icon: React.ReactNode
    title: string
}

function ContactButton({ icon, title }: buttonProps) {
    return(
        <div className={styles.contactButton}>
          <span className={styles.icon}>{icon}</span>
          <h3 className={styles.title}>{title}</h3>
        </div>
    )
}
export default ContactButton;