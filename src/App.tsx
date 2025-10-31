import './index.css'
import 'leaflet/dist/leaflet.css';

import Cities from './components/cities'
import Boxes from './components/boxes'
import { MdOutlineInventory } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import { FaShippingFast, FaWhatsapp } from 'react-icons/fa'
import ContactButton from './components/contact-button'

import logoDaEmpresa from './assets/logo.png';
import Values from './components/Values';
import ContactUs from './components/contact-us';

const linkWhatsapp = "https://wa.me/5531985704428?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20transportadora%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

function App() {
  return (
    <div className='global-container'>
      <header className='header-container'>
        <div className='header-div'>
          <img src={logoDaEmpresa} alt="Logo Transportes Linhares" className='logo' />
          <a href={linkWhatsapp} target='_blank'>
            <ContactButton
              icon={<FaWhatsapp />}
              title='Fale conosco'
            />
          </a>
        </div>
      </header>

      <main className='main-container'>
        <div className='section-div'>
          <div className='text-content'>
            <h1>Sua carga, nossa prioridade.</h1>
            <h2>Mais do que uma transportadora, somos o parceiro logístico que sua empresa precisa para crescer. Entregas em toda zona da mata mineira com a agilidade que o seu negócio exige.</h2>
          </div>
        </div>
        <div className='boxes'>
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
            description='Sua encomenda urgente é nossa prioridade. Atendemos demandas com prazo crítico (consulte regiões).'
          />
        </div>
        <Cities />

        <Values />

        <ContactUs />
      </main>
      <footer className='footer-container'>
        <h3>© Todos os direitos reservados | Transportes Linhares</h3>
      </footer>
    </div>
  )
}

export default App