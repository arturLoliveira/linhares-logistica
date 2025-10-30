import { FaMapMarkerAlt } from "react-icons/fa";
import { useInView } from "react-intersection-observer";


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

function Cities() {
    const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
    return (
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
    )
}
export default Cities;