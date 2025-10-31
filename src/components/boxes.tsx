
import styles from '../styles/boxes.module.css';

interface BoxItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function Boxes({ icon, title, description }: BoxItemProps) {
    return (
        <div className={styles.boxCargas}>
            {icon}
            <h3 className={styles.title}>{title}</h3>
            <p>{description}</p>
        </div>
    )
}

export default Boxes;