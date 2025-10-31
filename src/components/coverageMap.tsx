import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from '../styles/coverage-map.module.css';
import MinasGeraisMap from '../assets/minas.svg?react';

const todasAsCidades = [
    { nome: 'Ouro Branco', top: '48%', left: '52%', isFeatured: true },
    { nome: 'Carandaí', top: '55%', left: '50%' },
    { nome: 'Cristiano Otoni', top: '66%', left: '49%' },
    { nome: 'Casa Grande', top: '57%', left: '45%' },
    { nome: 'Capela Nova', top: '58%', left: '40%' },
    { nome: 'Queluzito', top: '59%', left: '36%' },
    { nome: 'Santana dos Montes', top: '65%', left: '45%' },
    { nome: 'Caranaíba', top: '70%', left: '44%' },
    { nome: 'Cons. Lafaiete', top: '50%', left: '48%' },
    { nome: 'Jeceaba', top: '45%', left: '45%' },
    { nome: 'São Bras do Suaçuí', top: '42%', left: '42%' },
    { nome: 'Entre Rios de Minas', top: '40%', left: '38%' },
    { nome: 'Desterro de Entre Rios', top: '48%', left: '38%' },
    { nome: 'Congonhas', top: '40%', left: '48%' },
    { nome: 'Belo Vale', top: '37%', left: '45%' },
    { nome: 'Moeda', top: '34%', left: '42%' },
    { nome: 'Itaverava', top: '60%', left: '55%' },
    { nome: 'Catas Altas da Noruega', top: '60%', left: '63%' },
    { nome: 'Rio Espera', top: '59%', left: '59%' },
    { nome: 'Lamin', top: '66%', left: '56%' },
    { nome: 'Senhora de Oliveira', top: '65%', left: '62%' },
    { nome: 'Piranga', top: '70%', left: '60%' },
    { nome: 'Ouro Preto', top: '38%', left: '58%' },
    { nome: 'Mariana', top: '37%', left: '62%' },
    { nome: 'Itabirito', top: '30%', left: '57%' },
    { nome: 'Cachoeira do Campo', top: '32%', left: '50%' },
];


function CoverageMap() {
    return (
        <section className={styles.coverageSection}>
            <h2 className={styles.title}>Nossa Cobertura Regional</h2>

            <div className={styles.mapContainer}>

                <div className={styles.mapZoomWrapper}>

                    <MinasGeraisMap className={styles.mapImage} />

                    {todasAsCidades.map((cidade) => (
                        <div
                            key={cidade.nome}
                            className={`${styles.marker} ${cidade.isFeatured ? styles.markerFeatured : ''}`} style={{ left: cidade.left, top: cidade.top }}
                        >
                            <FaMapMarkerAlt />
                            <span className={styles.tooltip} translate="no">{cidade.nome}</span>
                        </div>
                    ))}

                </div>
            </div>

            <div className={styles.infoCardsContainer}>
                <div className={styles.infoCard}>
                    <p className={styles.label}>Cidades Atendidas</p>
                    <h3 className={styles.value}>+25 Municípios</h3>
                </div>
                <div className={styles.infoCard}>
                    <p className={styles.label}>Regiões Cobertas</p>
                    <h3 className={styles.value}>Metropolitana de BH, Campo das Vertentes e região central de Minas Gerais</h3>
                </div>
                <div className={styles.infoCard}>
                    <p className={styles.label}>Entregas Mensais</p>
                    <h3 className={styles.value}>+10.000 Entregas</h3>
                </div>
            </div>
        </section>
    );
}

export default CoverageMap;