// Lógica do ícone do Leaflet...
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { AiFillInstagram, AiOutlineMail } from "react-icons/ai"; // Usei AiOutlineMail para o Email
import { MdLocationOn } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import ContactInfo from "./contactInfo";

import styles from '../styles/contact-us.module.css';

const posicaoGalpao = [-20.525125, -43.701911] as [number, number];
const googleMapsUrl = `http://googleusercontent.com/maps/google.com/10{posicaoGalpao[0]},${posicaoGalpao[1]}`;

function ContactUs() {
    return (
        <div className={styles.contactUs}>
            <h2 className={styles.sectionTitle}>Contatos</h2>
            <p className={styles.contactSubtitle}>
                Diversos canais de comunicação para que você se sinta mais à vontade para nos contactar quando quiser.
            </p>

            <div className={styles.contactCardsContainer}>

                <div className={styles.mapContact}>
                    <MapContainer center={posicaoGalpao} zoom={16} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

                <div className={styles.contact}>
                    <h3 className={styles.contactTitle}>Estamos aqui para lhe atender!</h3>

                    <hr className={styles.divider} />
                    <ContactInfo
                        icon={<FaPhone />}
                        info="31 993751683"
                    />
                    <ContactInfo
                        icon={<AiOutlineMail />}
                        info="transporteslinhares7@gmail.com"
                        isLink={true}
                    />
                    <ContactInfo
                        icon={<FaMapMarkerAlt />}
                        info="Rua Santo Antônio, 1372, Centro, Ouro Branco"
                    />
                    <a
                        href="https://www.instagram.com/transportes.linhares"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactInfoLink}
                        translate="no"
                    >
                        <ContactInfo
                            icon={<AiFillInstagram />}
                            info="@transportes.linhares"
                        />
                    </a>
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactMapButton}
                    >
                        <MdLocationOn className={styles.buttonIcon} />
                        <span className={styles.buttonText}>Ver no Google Maps</span>
                    </a>
                </div>
                <div className={styles.contactForm}>
                    <h3 className={styles.contactTitle}>
                        Ou nos envie um e-mail
                    </h3>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="nome" className={styles.formLabel}>Nome</label>
                            <input type="text" id="nome" className={styles.formInput} placeholder="Seu nome completo" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>E-mail</label>
                            <input type="email" id="email" className={styles.formInput} placeholder="seu.email@exemplo.com" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="telefone" className={styles.formLabel}>Telefone</label>
                            <input type="tel" id="telefone" className={styles.formInput} placeholder="(XX) 9XXXX-XXXX" />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="mensagem" className={styles.formLabel}>Mensagem</label>
                            <textarea id="mensagem" className={styles.formTextarea} rows={4} placeholder="Digite sua cotação ou dúvida..." required></textarea>
                        </div>

                        <button type="submit" className={styles.formButton}>Enviar Mensagem</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContactUs;