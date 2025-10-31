import styles from '../styles/contact-info.module.css';

interface ContactInfoProps {
    icon: React.ReactNode;
    info: string;
    isLink?: boolean;
}

function ContactInfo({ icon, info, isLink = false }: ContactInfoProps) {
    
    const InfoContent = () => {
        if (isLink) {
            return (
                <h4 className={styles.infoText}>
                    <a href={`mailto:${info}`} className={styles.link}>
                        {info}
                    </a>
                </h4>
            );
        }

        return (
            <h4 className={styles.infoText}>
                {info}
            </h4>
        );
    };
    
    return (
        <div className={styles.contactInfo} translate="no">
            {icon}
            <InfoContent />
        </div>
    )
}

export default ContactInfo;