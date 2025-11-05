import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    VStack,
    Center,
    Alert,
    AlertIcon,
    Icon
} from '@chakra-ui/react';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'; 

function DriverUpdatePage() {
    const [searchParams] = useSearchParams(); 

    const numeroEncomenda = searchParams.get('id'); 
    const token = searchParams.get('token'); //

    const [localizacao, setLocalizacao] = useState(''); 
    const [status, setStatus] = useState('COLETADO'); 
    const [mensagem, setMensagem] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [erro, setErro] = useState(''); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setIsLoading(true); 
        setErro(''); 
        setMensagem(''); 
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        try {
            const response = await fetch(`${API_URL}/api/driver/update`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({
                    numeroEncomenda,
                    token,
                    status,
                    localizacao
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao atualizar.'); 
            }
            setMensagem('Status atualizado com sucesso!'); 

        } catch (err) {
            setErro((err as Error).message); 
        } finally {
            setIsLoading(false); 
        }
    };

    if (!numeroEncomenda || !token) { 
        return (
            <Center minH="80vh" p={4}>
                <Box textAlign="center" p={8} borderWidth={1} borderRadius="lg" shadow="md">
                    <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
                    <Heading as="h2" size="lg" mt={4} mb={2}>Erro: Link Inválido</Heading>
                    <Text>Por favor, escaneie o QR Code novamente.</Text>
                </Box>
            </Center>
        );
    }
    
    if (mensagem) { 
         return (
            <Center minH="80vh" p={4}>
                <Box textAlign="center" p={8} borderWidth={1} borderRadius="lg" shadow="md">
                    <Icon as={FaCheckCircle} boxSize={12} color="green.500" />
                    <Heading as="h2" size="lg" mt={4} mb={2}>Sucesso!</Heading>
                    <Text>{mensagem}</Text>
                </Box>
            </Center>
        );
    }

    return (
        <Center minH="80vh" py={8} px={4}>
            <Box
                as="form"
                onSubmit={handleSubmit} 
                w={{ base: '90%', md: '450px' }}
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" textAlign="center">Atualizar Encomenda</Heading>
                <Text textAlign="center" fontSize="xl" color="gray.600" mb={6}>Nº: {numeroEncomenda}</Text>

                <VStack spacing={4}>
                    <FormControl id="localizacao" isRequired>
                        <FormLabel>Sua Localização Atual</FormLabel>
                        <Input 
                            type="text" 
                            value={localizacao}
                            onChange={(e) => setLocalizacao(e.target.value)} 
                            placeholder="Ex: Sede Ouro Branco"
                        />
                    </FormControl>
                    <FormControl id="status" isRequired>
                        <FormLabel>Marcar como:</FormLabel>
                        <Select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                        >
                            <option value="COLETADO">Coletado (Retirado no cliente)</option>
                            <option value="EM_TRANSITO">Em Trânsito (Chegou no CD)</option>
                            <option value="EM_ROTA_ENTREGA">Em Rota de Entrega (Saiu para o destino)</option>
                            <option value="CONCLUIDA">Entregue</option>
                        </Select>
                    </FormControl>

                    {erro && (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            {erro}
                        </Alert>
                    )}

                    <Button 
                        type="submit" 
                        colorScheme="blue" 
                        width="100%"
                        isLoading={isLoading} 
                        loadingText="Atualizando..."
                    >
                        Atualizar Status
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
}
export default DriverUpdatePage;