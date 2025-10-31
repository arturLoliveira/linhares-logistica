import { FaMapMarkerAlt } from "react-icons/fa";
import { useInView } from "react-intersection-observer";


const regioesData = [
  {
    titulo: 'Polo Ouro Branco',
    cidades: ['Ouro Branco']
  },
  {
    titulo: 'Polo Carandaí',
    cidades: ['Carandaí', 'Cristiano Otoni', 'Casa Grande', 'Capela Nova', 'Queluzito', 'Santana dos montes', 'Caranaíba']
  },
  {
    titulo: 'Polo Cons. Lafaiete',
    cidades: ['Cons. Lafaiete']
  },
  {
    titulo: 'Jeceaba',
    cidades: ['Jeceaba','São Bras do Suaçui','Entre Rios de Minas', 'Desterro de entre rios']
  },
  {
    titulo: 'Polo Congonhas',
    cidades: ['Congonhas','Belo vale', 'Moeda']
  },
  {
    titulo: 'Itaverava',
    cidades: [,'Itaverava','Catas altas da noruega', 'Rio espera', 'Lamimm', 'Senhora de oliveira', 'Piranga']
  },
  {
    titulo: 'Polo Ouro Preto',
    cidades: ['Ouro preto','Mariana', 'Itabirito', 'Cachoeira do campo']
  },
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
                style={{ transitionDelay: `${index * 300}ms` }}
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