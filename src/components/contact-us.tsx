// Lógica do ícone do Leaflet (deixei como estava)
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

import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import ContactInfo from "./contactInfo";

import styles from '../styles/contact-us.module.css';

const posicaoGalpao = [-20.525125, -43.701911] as [number, number];
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${posicaoGalpao[0]},${posicaoGalpao[1]}`;

function ContactUs() {
    return (
        <div className={styles.contactUs}>
            <h2 className={styles.sectionTitle}>Contatos</h2>

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
                        icon={<FaEnvelope />}
                        info="transporteslinhares7@gmail.com"
                        isLink={true} 
                    />
                    <ContactInfo
                        icon={<FaMapMarkerAlt />}
                        info="Rua Santo Antônio, 1372, Centro, Ouro Branco"
                    />

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
            </div>
        </div>
    )
}

export default ContactUs;