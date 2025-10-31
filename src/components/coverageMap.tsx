import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa'; 
import styles from '../styles/coverage-map.module.css';
import MinasGeraisMap from '../assets/minas.svg?react';

// 1. NOVA LISTA DE CIDADES (FLAT)
//    VOCÊ PRECISA AJUSTAR CADA 'top' E 'left' MANUALMENTE
const todasAsCidades = [
  // Polo Ouro Branco
  { nome: 'Ouro Branco', top: '48%', left: '52%' }, // <-- AJUSTE AQUI
  // Polo Carandaí
  { nome: 'Carandaí', top: '55%', left: '50%' }, // <-- AJUSTE AQUI
  { nome: 'Cristiano Otoni', top: '56%', left: '49%' }, // <-- AJUSTE AQUI
  { nome: 'Casa Grande', top: '57%', left: '48%' }, // <-- AJUSTE AQUI
  { nome: 'Capela Nova', top: '58%', left: '47%' }, // <-- AJUSTE AQUI
  { nome: 'Queluzito', top: '59%', left: '46%' }, // <-- AJUSTE AQUI
  { nome: 'Santana dos Montes', top: '60%', left: '45%' }, // <-- AJUSTE AQUI
  { nome: 'Caranaíba', top: '61%', left: '44%' }, // <-- AJUSTE AQUI
  // Polo Cons. Lafaiete
  { nome: 'Cons. Lafaiete', top: '50%', left: '48%' }, // <-- AJUSTE AQUI
  // Polo Jeceaba
  { nome: 'Jeceaba', top: '45%', left: '45%' }, // <-- AJUSTE AQUI
  { nome: 'São Bras do Suaçuí', top: '46%', left: '44%' }, // <-- AJUSTE AQUI
  { nome: 'Entre Rios de Minas', top: '47%', left: '43%' }, // <-- AJUSTE AQUI
  { nome: 'Desterro de Entre Rios', top: '48%', left: '42%' }, // <-- AJUSTE AQUI
  // Polo Congonhas
  { nome: 'Congonhas', top: '40%', left: '48%' }, // <-- AJUSTE AQUI
  { nome: 'Belo Vale', top: '39%', left: '47%' }, // <-- AJUSTE AQUI
  { nome: 'Moeda', top: '38%', left: '46%' }, // <-- AJUSTE AQUI
  // Polo Itaverava
  { nome: 'Itaverava', top: '60%', left: '55%' }, // <-- AJUSTE AQUI
  { nome: 'Catas Altas da Noruega', top: '61%', left: '56%' }, // <-- AJUSTE AQUI
  { nome: 'Rio Espera', top: '62%', left: '57%' }, // <-- AJUSTE AQUI
  { nome: 'Lamin', top: '63%', left: '58%' }, // <-- AJUSTE AQUI
  { nome: 'Senhora de Oliveira', top: '64%', left: '59%' }, // <-- AJUSTE AQUI
  { nome: 'Piranga', top: '65%', left: '60%' }, // <-- AJUSTE AQUI
  // Polo Ouro Preto
  { nome: 'Ouro Preto', top: '38%', left: '58%' }, // <-- AJUSTE AQUI
  { nome: 'Mariana', top: '37%', left: '59%' }, // <-- AJUSTE AQUI
  { nome: 'Itabirito', top: '36%', left: '57%' }, // <-- AJUSTE AQUI
  { nome: 'Cachoeira do Campo', top: '35%', left: '56%' }, // <-- AJUSTE AQUI
];


function CoverageMap() {
  return (
    <section className={styles.coverageSection}>
      <h2 className={styles.title}>Nossa Cobertura Regional</h2>

      <div className={styles.mapContainer}>
        <MinasGeraisMap className={styles.mapImage} />

        {/* 2. O mapa agora cria os 29 pinos dinamicamente */}
        {todasAsCidades.map((cidade) => (
          <div 
            key={cidade.nome}
            className={styles.marker} 
            style={{ left: cidade.left, top: cidade.top }}
          >
            <FaMapMarkerAlt />
            <span className={styles.tooltip} translate="no">{cidade.nome}</span>
          </div>
        ))}

      </div>

      {/* 3. A coluna da direita agora são os CARTÕES DE ESTATÍSTICA */}
      <div className={styles.infoCardsContainer}>
        <div className={styles.infoCard}>
          <p className={styles.label}>Cidades Atendidas</p>
          <h3 className={styles.value}>+25 Municípios</h3>
        </div>
        <div className={styles.infoCard}>
          <p className={styles.label}>Regiões Cobertas</p>
          <h3 className={styles.value}>Metropolitana de BH, Campo das Vertentes e Zona da Mata</h3>
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