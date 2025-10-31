import { FaSitemap, FaTags, FaTruckMoving, FaUsers } from "react-icons/fa";
import values from "../assets/values.jpg"

function Values() {
    return (
        <section className="features-section">
            <h2 className="section-title-features">
                Compromisso em cada detalhe,
                <strong>da cotação ao destino final.</strong>
            </h2>

            <div className="features-content">

                <div className="features-image">
                    <img src={values} alt="Equipe de logística trabalhando" />
                </div>

                <div className="features-grid">

                    <div className="feature-card feature-card--primary">
                        <FaUsers />
                        Atendimento Especializado
                    </div>

                    <div className="feature-card feature-card--secondary">
                        <FaTruckMoving />
                        Frota Própria e Confiável
                    </div>

                    <div className="feature-card feature-card--secondary">
                        <FaSitemap />
                        Logística Integrada
                    </div>

                    <div className="feature-card feature-card--primary">
                        <FaTags />
                        Custo-Benefício
                    </div>

                </div>
            </div>

        </section>
    )
}
export default Values;