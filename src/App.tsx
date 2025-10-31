import './index.css'
import 'leaflet/dist/leaflet.css';
import styles from './styles/app.module.css';

import Boxes from './components/boxes'
import { MdOutlineInventory } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import { FaShippingFast } from 'react-icons/fa'

import Values from './components/Values';
import ContactUs from './components/contact-us';
import Footer from './components/footer';
import Header from './components/header';
import Landing from './components/Landing';
import CoverageMap from './components/coverageMap';
import WhoWeAre from './components/whoWeAre';


function App() {
  return (

    <div className={styles.globalContainer}>
      <Header />

      <main className={styles.mainContainer}>
       
          <Landing />
          <div className={styles.boxes}>
            <Boxes
              icon={<MdOutlineInventory fontSize={40} />}
              title="Carga dedicada"
              description='Um veículo exclusivo para sua entrega, garantindo agilidade máxima da coleta ao destino final.'
            />
            <Boxes
              icon={<TbTruckDelivery fontSize={45} />}
              title='Carga Fracionada'
              description='A solução inteligente e com melhor custo-benefício para enviar volumes menores.'
            />
            <Boxes
              icon={<FaShippingFast fontSize={45} />}
              title='Entregas Expressas'
              description='Sua carga urgente é nossa prioridade. Atendemos demandas com prazo crítico (consulte regiões).'
            />
          </div>
        
        <CoverageMap />
        <WhoWeAre />
        <Values />
        <ContactUs />
      </main>
      
      <Footer />
    </div>
  )
}

export default App