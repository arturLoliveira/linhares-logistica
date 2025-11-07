import { useState } from 'react';
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

import { useForm, ValidationError } from '@formspree/react';
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    Divider,
    Link,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Spacer,
    useToast
} from '@chakra-ui/react';

const posicaoGalpao = [-20.525125, -43.701911] as [number, number];
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${posicaoGalpao[0]},${posicaoGalpao[1]}`;

function ContactUs() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [state] = useForm("xldoynye");
    const toast = useToast();
    const API_URL = 'https://linhares-logistica-backend.onrender.com';


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = { nome, telefone, email, mensagem };

        try {
            const response = await fetch(`${API_URL}/api/contato/enviar-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao enviar mensagem.');
            }

            toast({
                title: 'Mensagem Enviada!',
                description: 'Agradecemos o seu contato. Responderemos em breve.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setNome(''); setTelefone(''); setEmail(''); setMensagem('');

        } catch (error) {
            toast({
                title: 'Erro no Envio.',
                description: (error as Error).message,
                status: 'error',
                duration: 7000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box as="section" w="100%" py={16} bg="#F0F4FA" id="contato">
            <Heading as="h2" size="xl" textAlign="center" mb={10}>
                Contatos
            </Heading>

            <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                spacing={8}
                maxW="1400px"
                mx="auto"
                px={4}
                alignItems="stretch"
            >
                <Box bg="white" borderRadius="md" overflow="hidden" shadow="lg">
                    <MapContainer
                        center={posicaoGalpao}
                        zoom={16}
                        scrollWheelZoom={true}
                        style={{ height: '100%', minHeight: '500px', width: '100%' }}
                    >
                        <TileLayer
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={posicaoGalpao}>
                            <Popup>
                                <div>
                                    <b>Galpão de distribuição</b><br /><br />
                                    <a href={googleMapsUrl} target='_blank' rel='noopener noreferrer'>
                                        Abrir no Google Maps
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Box>

                <VStack
                    spacing={5}
                    align="flex-start"
                    p={6}
                    bg="white"
                    borderRadius="md"
                    shadow="lg"
                    flex="1"
                >
                    <Heading as="h3" size="lg">
                        Estamos aqui para lhe atender!
                    </Heading>
                    <Divider />
                    <ContactInfo icon={<FaPhone />} info="31 993751683" />
                    <ContactInfo icon={<AiOutlineMail />} info="transporteslinhares7@gmail.com" isLink={true} />
                    <ContactInfo icon={<FaMapMarkerAlt />} info="Rua Santo Antônio, 1372, Centro, Ouro Branco" />
                    <Link
                        href="https://www.instagram.com/transportes.linhares"
                        target="_blank"
                        rel="noopener noreferrer"
                        _hover={{ textDecoration: 'none' }}
                    >
                        <ContactInfo icon={<AiFillInstagram />} info="@transportes.linhares" />
                    </Link>

                    <Spacer />

                    <Button
                        as={Link}
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<MdLocationOn />}
                        colorScheme="blue"
                        variant="outline"
                        w="100%"
                    >
                        Ver no Google Maps
                    </Button>
                </VStack>

                <Box
                    as="form"
                    onSubmit={handleSubmit}
                    p={6}
                    bg="white"
                    borderRadius="md"
                    shadow="lg"
                    display="flex"
                    flexDirection="column"
                >
                    <VStack spacing={4} flex="1">
                        <Heading as="h3" size="lg" w="100%">
                            Ou envie uma mensagem
                        </Heading>
                        <Text w="100%">
                            Diversos canais de comunicação para que você se sinta mais à vontade.
                        </Text>

                        <SimpleGrid columns={2} spacing={4} w="100%">
                            <FormControl isRequired>
                                <FormLabel>Nome</FormLabel>
                                <Input type="text" id="nome" name="nome" placeholder="Seu nome" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Telefone</FormLabel>
                                <Input type="tel" id="telefone" name="telefone" placeholder="(XX) 9XXXX-XXXX" />
                            </FormControl>
                        </SimpleGrid>

                        <FormControl isRequired>
                            <FormLabel>E-mail</FormLabel>
                            <Input type="email" id="email" name="email" placeholder="seu.email@exemplo.com" />
                            <ValidationError prefix="Email" field="email" errors={state.errors} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Mensagem</FormLabel>
                            <Textarea id="mensagem" name="mensagem" rows={4} placeholder="Digite sua cotação ou dúvida..." />
                            <ValidationError prefix="Mensagem" field="mensagem" errors={state.errors} />
                        </FormControl>

                        <Spacer />

                        <Button
                            type="submit"
                            colorScheme="blue"
                            w="100%"
                            isLoading={isLoading}
                        >
                            Enviar Mensagem
                        </Button>
                    </VStack>
                </Box>
            </SimpleGrid>
        </Box>
    )
}

export default ContactUs;