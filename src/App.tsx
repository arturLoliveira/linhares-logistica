import { MdOutlineInventory } from 'react-icons/md'
import './index.css'
import { TbTruckDelivery } from 'react-icons/tb'
import { FaShippingFast, FaMapMarkerAlt } from 'react-icons/fa' 
import { useInView } from "react-intersection-observer"

const regioesData = [
  {
    titulo: 'Região de Ouro Preto',
    cidades: ['Ouro Preto', 'Mariana', 'Catas Altas', 'Cachoeira do Campo', 'Itabirito']
  },
  {
    titulo: 'Região de Lafaiete',
    cidades: ['Cons. Lafaiete', 'Congonhas', 'Queluzito', 'Casa Grande', 'Cristiano Otoni', 'São Brás do Suaçuí']
  },
  {
    titulo: 'Região de Entre Rios',
    cidades: ['Entre Rios de Minas', 'Desterro de Entre Rios', 'Belo Vale', 'Moeda', 'Jeceaba']
  },
  {
    titulo: 'Região de Piranga',
    cidades: ['Piranga', 'Itaverava', 'Santana dos Montes', 'Capela Nova', 'Senhora de Oliveira', 'Rio Espera', 'Lamin', 'Caranaíba', 'Carandaí']
  }
];

function App() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className='global-container'>
      <header className='header-container'>
        <div className='header-div'>
          <h1>Transportes Linhares</h1>
          <button>Entre em contato</button>
        </div>
      </header>

      <main className='main-container'>
        <div className='section-div'>
          <div className='text-content'>
            <h1>A sua carga, nossa prioridade.</h1>
            <h2>Mais do que uma transportadora, somos o parceiro logístico que sua empresa precisa para crescer. Entregas em toda Zona da mata Mineira com a agilidade que o seu negócio exige.</h2>
          </div>
        </div>

        <section className='section-right'>
          <div className='box-cargas'>
            <MdOutlineInventory fontSize={40} />
            <h3>Carga dedicada</h3> 
            <p>Um veículo exclusivo para sua entrega, garantindo agilidade máxima da coleta ao destino final.</p>
          </div>
          <div className='box-cargas'>
            <TbTruckDelivery fontSize={45} />
            <h3>Carga Fracionada</h3> 
            <p>A solução inteligente e com melhor custo-benefício para enviar volumes menores.</p>
          </div>
          <div className='box-cargas'>
            <FaShippingFast fontSize={45} />
            <h3>Entregas Expressas</h3> 
            <p>Sua encomenda urgente é nossa prioridade. Atendemos demandas com prazo crítico (consulte regiões).</p>
          </div>
        </section>
        
        <div className="area-atuacao-container" ref={ref}>

          <h2>Nossa Cobertura Regional</h2>
          <p className="subtitulo">
            Dividimos nossa logística por centros regionais para garantir sua entrega.
          </p>

          <div className="atuacao-grid">

            {regioesData.map((regiao, index) => (

              <div
                key={regiao.titulo}
                className={`regiao-grupo ${inView ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${index * 550}ms` }}
              >
                <h4>{regiao.titulo}</h4>
                <ul>
                  {regiao.cidades.map((cidade) => (
                    <li key={cidade}>
                      <FaMapMarkerAlt className="icon-pin" />
                      {cidade}
                    </li>
                  ))}
                </ul>
              </div>

            ))}
            
          </div>
        </div>
      </main>

      <footer className='footer-container'></footer>
    </div>
  )
}

export default App