import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import ContactInfo from "./contactInfo";


const posicaoGalpao = [-20.525125, -43.701911] as [number, number];
const googleMapsUrl = `https://www.google.com/maps?q=${posicaoGalpao[0]},${posicaoGalpao[1]}`;

function ContactUs() {
    return (
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
                        icon={<FaPhone className='iconContact' />}
                        info="31 993751683"
                    />
                    <ContactInfo
                        icon={<FaEnvelope className='iconContact' />}
                        info="transporteslinhares7@gmail.com"
                    />
                    <ContactInfo
                        icon={<FaMapMarkerAlt className='iconContact' />}
                        info="Rua Santo Antônio, 1372, Centro, Ouro Branco"
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
    )
}
export default ContactUs;