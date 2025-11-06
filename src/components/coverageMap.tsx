import { useState } from 'react'; 
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa'; 
import MinasGeraisMap from '../assets/minas.svg?react';
import {
    Box,
    Heading,
    Icon,
    Text,
    Tooltip,
    Grid, 
    GridItem, 
    VStack, 
    Stat,
    StatLabel,
    StatNumber,
    InputGroup,      
    InputRightElement, 
    Input,
    IconButton,
    FormControl,
    Center,
    Spinner,
    List, 
    ListItem, 
    ListIcon, 
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md'; 


interface EventoHistorico {
    data: string;
    status: string;
    localizacao: string;
}

interface ResultadoRastreio {
    numeroEncomenda: string;
    status: string;
    historico: EventoHistorico[];
}

function RastreioIntegradoBox() {
    const [searchId, setSearchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [resultado, setResultado] = useState<ResultadoRastreio | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDENTE': return 'yellow';
            case 'COLETADO': return 'blue';
            case 'EM_TRANSITO': return 'cyan';
            case 'EM_ROTA_ENTREGA': return 'orange';
            case 'CONCLUIDA': return 'green';
            case 'CANCELADA': return 'red';
            case 'EM_DEVOLUCAO': return 'purple';
            default: return 'gray';
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResultado(null);
        setErro('');
        
        if (!searchId) {
            setErro('Digite o número da encomenda ou NF.');
            setIsLoading(false);
            return;
        }

        try {
            const url = `https://linhares-logistica-backend.onrender.com/api/rastreamento/publico/${searchId.trim()}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (!res.ok) {
                 const data = await res.json();
                 throw new Error(data.error || 'Encomenda/NF não encontrada.');
            }
            
            const data: ResultadoRastreio = await res.json(); 
            setResultado(data);
            setErro('');
            
        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box 
            p={6} 
            shadow="md" 
            borderRadius="md" 
            bg="white"
            borderLeftWidth="5px" 
            borderLeftColor="blue.500" 
            as="form" 
            onSubmit={handleSubmit}
        > 
            <VStack spacing={4} align="stretch">
                <Stat>
                    <StatLabel fontSize="sm" color="gray.600">Busca Rápida de Status</StatLabel>
                    <StatNumber fontSize="xl" fontWeight="bold" color="blue.700">Acompanhe sua Entrega</StatNumber>
                </Stat>

                <FormControl isRequired>
                    <InputGroup size="md">
                        <Input 
                            type="text" 
                            value={searchId} 
                            onChange={e => setSearchId(e.target.value)} 
                            placeholder="Nº da NF ou Encomenda"
                            pr="3rem" 
                        />
                        <InputRightElement width="3rem">
                            <IconButton 
                                aria-label="Rastrear"
                                icon={<FaSearch />}
                                type="submit"
                                colorScheme="blue"
                                size="sm"
                                isLoading={isLoading}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {isLoading && <Center><Spinner size="sm" color="blue.500" /></Center>}
                {erro && <Text color="red.500" fontSize="sm">{erro}</Text>}
                
                {resultado && (
                    <Box pt={1} borderTopWidth="1px" borderColor="gray.100">
                        <Text fontSize="md" fontWeight="bold" color="gray.700">
                            Status: <Text as="span" color={`${getStatusColor(resultado.status)}.600`}>{resultado.status.replace(/_/g, ' ')}</Text>
                        </Text>
                        
                        <Heading as="h5" size="xs" mt={3} mb={1} color="gray.600">Histórico de Eventos</Heading>
                        <List spacing={1} fontSize="sm">
                            {resultado.historico && resultado.historico.map((evento, index) => (
                                 <ListItem key={index} >
                                    <ListIcon as={MdCheckCircle} color={getStatusColor(evento.status) === 'green' ? 'green.500' : 'blue.500'} />
                                    <Text as="span" fontWeight="medium" mr={1}>
                                        {new Date(evento.data).toLocaleDateString('pt-BR')} - 
                                    </Text>
                                    {evento.localizacao} ({evento.status.replace(/_/g, ' ')})
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}

function StatBox({ label, value }: { label: string, value: string }) {
    return (
        <Box 
            p={6} 
            shadow="md" 
            borderRadius="md" 
            bg="white"
            borderLeftWidth="5px" 
            borderLeftColor="blue.500"
        > 
            <Stat>
                <StatLabel fontSize="sm" color="gray.600">{label}</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold" color="blue.600">{value}</StatNumber>
            </Stat>
        </Box>
    );
}

const todasAsCidades = [
    
    { nome: 'Ouro Branco', top: '48%', left: '52%', isFeatured: true },
    { nome: 'Carandaí', top: '55%', left: '50%' },
    { nome: 'Cristiano Otoni', top: '66%', left: '49%' },
    { nome: 'Casa Grande', top: '57%', left: '45%' },
    { nome: 'Capela Nova', top: '58%', left: '40%' },
    { nome: 'Queluzito', top: '59%', left: '36%' },
    { nome: 'Santana dos Montes', top: '65%', left: '45%' },
    { nome: 'Caranaíba', top: '70%', left: '44%' },
    { nome: 'Cons. Lafaiete', top: '50%', left: '48%' },
    { nome: 'Jeceaba', top: '45%', left: '45%' },
    { nome: 'São Bras do Suaçuí', top: '42%', left: '42%' },
    { nome: 'Entre Rios de Minas', top: '40%', left: '38%' },
    { nome: 'Desterro de Entre Rios', top: '48%', left: '38%' },
    { nome: 'Congonhas', top: '40%', left: '48%' },
    { nome: 'Belo Vale', top: '37%', left: '45%' },
    { nome: 'Moeda', top: '34%', left: '42%' },
    { nome: 'Itaverava', top: '60%', left: '55%' },
    { nome: 'Catas Altas da Noruega', top: '60%', left: '63%' },
    { nome: 'Rio Espera', top: '59%', left: '59%' },
    { nome: 'Lamin', top: '66%', left: '56%' },
    { nome: 'Senhora de Oliveira', top: '65%', left: '62%' },
    { nome: 'Piranga', top: '70%', left: '60%' },
    { nome: 'Ouro Preto', top: '38%', left: '58%' },
    { nome: 'Mariana', top: '37%', left: '62%' },
    { nome: 'Itabirito', top: '30%', left: '57%' },
    { nome: 'Cachoeira do Campo', top: '32%', left: '50%' },
];

function CoverageMap() {
    return (
        
        <Box as="section" w="100%" py={16} bg="#F0F4FA"> 
            <Heading as="h2" size="xl" textAlign="center" color="blue.700" mb={10}>
                Nossa Cobertura Regional
            </Heading>

            <Grid
                templateColumns={{ base: '1fr', lg: '2fr 1fr' }} 
                gap={8}
                maxW="1400px" 
                mx="auto"
                px={4}
            >
                <GridItem 
                    h={{ base: '500px', lg: 'auto' }}
                >
                    <Box position="relative" w="100%" h="100%" minH="450px"> 
                        <MinasGeraisMap 
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0
                            }}
                        />

                        {todasAsCidades.map((cidade) => (
                            <Tooltip key={cidade.nome} label={cidade.nome} hasArrow>
                                <Box
                                    position="absolute"
                                    
                                    style={{ left: cidade.left, top: cidade.top }} 
                                    transform="translate(-50%, -50%)"
                                    zIndex={cidade.isFeatured ? 10 : 1}
                                    color={cidade.isFeatured ? 'white' : 'gray.800'}
                                    fontSize="1.5rem"
                                    cursor="pointer"
                                    _hover={{
                                        transform: "translate(-50%, -50%) scale(1.5)",
                                        color: 'blue.500'
                                    }}
                                    filter={cidade.isFeatured ? 'drop-shadow(0px 0px 3px rgba(0,0,0,0.7))' : 'none'}
                                >
                                    <Icon as={FaMapMarkerAlt} />
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                </GridItem>

                <GridItem>
                    <VStack spacing={6} align="stretch">
                        <RastreioIntegradoBox /> 
                        
                        <StatBox label="Cidades Atendidas" value="+25 Municípios" />
                        <StatBox label="Regiões Cobertas" value="Metropolitana de BH, Campo das Vertentes e região central de Minas Gerais" />
                        <StatBox label="Entregas Mensais" value="+10.000 Entregas" />
                    </VStack>
                </GridItem>
            </Grid>
        </Box>
    );
}


export default CoverageMap;