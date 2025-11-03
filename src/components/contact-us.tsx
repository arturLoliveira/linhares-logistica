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
import { AiFillInstagram, AiOutlineMail } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import ContactInfo from "./contactInfo";
import styles from '../styles/contact-us.module.css';

import { useForm, ValidationError } from '@formspree/react';

const posicaoGalpao = [-20.525125, -43.701911] as [number, number];
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${posicaoGalpao[0]},${posicaoGalpao[1]}`; // Corrigido o link do Google Maps

function ContactUs() {

    const [state, handleSubmit] = useForm("xldoynye");

    if (state.succeeded) {
        return (
            <div className={styles.contactUs}>
                <h2 className={styles.sectionTitle}>Mensagem Enviada!</h2>
                <p style={{textAlign: 'center', fontSize: '1.2rem'}}>
                    Obrigado por entrar em contato. Responderemos em breve!
                </p>
            </div>
        );
    }

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
                        icon={<AiFillInstagram /> }
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
                        Ou envie uma mensagem
                    </h3>
                    <p className={styles.contactSubtitle}>
                        Diversos canais de comunicação para que você se sinta mais à vontade para nos contactar quando quiser.
                    </p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="nome" className={styles.formLabel}>Nome</label>
                            <input 
                              type="text" 
                              id="nome" 
                              name="nome" 
                              className={styles.formInput} 
                              placeholder="Seu nome completo" 
                              required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>E-mail</label>
                            <input 
                              type="email" 
                              id="email" 
                              name="email" 
                              className={styles.formInput} 
                              placeholder="seu.email@exemplo.com" 
                              required 
                            />
                            <ValidationError 
                              prefix="Email" 
                              field="email"
                              errors={state.errors}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="telefone" className={styles.formLabel}>Telefone</label>
                            <input 
                              type="tel" 
                              id="telefone" 
                              name="telefone" 
                              className={styles.formInput} 
                              placeholder="(XX) 9XXXX-XXXX" 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="mensagem" className={styles.formLabel}>Mensagem</label>
                            <textarea 
                              id="mensagem" 
                              name="mensagem" 
                              className={styles.formTextarea} 
                              rows={4} 
                              placeholder="Digite sua cotação ou dúvida..." 
                              required
                            ></textarea>

                            <ValidationError 
                              prefix="Mensagem" 
                              field="mensagem"
                              errors={state.errors}
                            />
                        </div>

                        <button 
                          type="submit" 
                          className={styles.formButton}
                          disabled={state.submitting}
                        >
                          {state.submitting ? "Enviando..." : "Enviar Mensagem"}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default ContactUs;