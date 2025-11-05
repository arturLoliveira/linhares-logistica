import { FaMapMarkerAlt } from 'react-icons/fa';
import MinasGeraisMap from '../assets/minas.svg?react';
import {
    Box,
    Heading,
    Icon,
    Tooltip,
    Grid, 
    GridItem, 
    VStack, 
    Stat,
    StatLabel,
    StatNumber
} from '@chakra-ui/react';

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
                        <StatBox label="Cidades Atendidas" value="+25 Municípios" />
                        <StatBox label="Regiões Cobertas" value="Metropolitana de BH, Campo das Vertentes e região central de Minas Gerais" />
                        <StatBox label="Entregas Mensais" value="+10.000 Entregas" />
                    </VStack>
                </GridItem>
            </Grid>
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

export default CoverageMap;