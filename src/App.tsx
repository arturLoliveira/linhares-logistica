import './index.css'
import 'leaflet/dist/leaflet.css';

import Cities from './cities'
import Boxes from './boxes'
import { MdEmail, MdLocationOn, MdOutlineInventory } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import { FaPhone, FaShippingFast, FaWhatsapp } from 'react-icons/fa'
import ContactButton from './contact-button'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import logoDaEmpresa from './assets/logo.png';
import ContactInfo from './contactInfo';

const posicaoGalpao = [-20.5249876, -43.7017278] as [number, number];
const googleMapsUrl = `https://www.google.com/maps?q=${posicaoGalpao[0]},${posicaoGalpao[1]}`;
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


        <div className='contactUs'>
          <h3 className='section-title'>Onde estamos</h3>
          <div className='contact-cards-container'>
            <div className='mapContact'>
              <MapContainer center={posicaoGalpao} zoom={16} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posicaoGalpao}>
                  <Popup>
                    <div>
                      <b>Galpão de distribuição</b>
                      <br />
                      <br />
                      <a href={googleMapsUrl} target='_blank' rel='noopener noreferrer'>
                        Abrir no Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className='contact'>
              <h3>Fale conosco</h3>
              <hr />
              <ContactInfo
                icon={<FaPhone />}
                info="31 98570-4428"
              />
              <ContactInfo
                icon={<MdEmail />}
                info="email@email.com"
              />
              <ContactInfo
                icon={<MdLocationOn />}
                info="rua tal de tal, 181, ouro branco"
              />
              <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-map-button"
            >
              <MdLocationOn /> 
              <span>Ver no Google Maps</span>
            </a>
            </div>
          </div>
        </div>
      </main>
      <footer className='footer-container'></footer>
    </div>
  )
}

export default App