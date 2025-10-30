import './index.css'
import Cities from './cities'
import Boxes from './boxes'
import { MdOutlineInventory } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import { FaShippingFast, FaWhatsapp } from 'react-icons/fa'
import ContactButton from './contact-button'


function App() {
  return (
    <div className='global-container'>
      <header className='header-container'>
        <div className='header-div'>
          <h1>Transportes Linhares</h1>
          <ContactButton
            icon={<FaWhatsapp fontSize={30} />}
            title='Fale conosco'
            />
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

      </main>

      <footer className='footer-container'></footer>
    </div>
  )
}

export default App