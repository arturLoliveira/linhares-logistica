import { useState } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
    Text
} from '@chakra-ui/react';

function FormAdminCadastraCliente() {
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';
            const response = await fetch(`${API_URL}/api/admin/clientes/registrar`, { //
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cpfCnpj, nome, email }) //
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao cadastrar.');
            }

            toast({
                title: 'Cliente cadastrado!',
                description: `Cliente ${data.nome || data.cpfCnpj} foi cadastrado com sucesso.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            
            setCpfCnpj(''); setNome(''); setEmail(''); //

        } catch (err) {
            toast({
                title: 'Erro ao cadastrar.',
                description: (err as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box 
            as="form" 
            onSubmit={handleSubmit} 
            w={{ base: '100%', md: '70%', lg: '50%' }} 
        >
            <Heading as="h4" size="md" mb={1}>
                Cadastrar Novo Cliente (Destinatário)
            </Heading>
            <Text mb={6}>
                Cadastre um cliente (destinatário) para vincular às coletas.
            </Text>
            
            <VStack spacing={4}>
                <FormControl id="cliente_cpfcnpj" isRequired>
                    <FormLabel>CPF/CNPJ do Cliente (Destinatário)</FormLabel>
                    <Input 
                        type="text" 
                        value={cpfCnpj} 
                        onChange={e => setCpfCnpj(e.target.value)} //
                    />
                </FormControl>
                
                <FormControl id="cliente_nome">
                    <FormLabel>Nome do Cliente (Opcional)</FormLabel>
                    <Input 
                        type="text" 
                        value={nome} 
                        onChange={e => setNome(e.target.value)} //
                    />
                </FormControl>

                <FormControl id="cliente_email">
                    <FormLabel>Email do Cliente (Opcional)</FormLabel>
                    <Input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} //
                    />
                </FormControl>
            </VStack>
            
            <Button 
                type="submit" 
                colorScheme="blue"
                mt={6}
                isLoading={isLoading} //
                loadingText="Cadastrando..."
            >
                Cadastrar Cliente
            </Button>
        </Box>
    );
}

function AdminClientes() {
    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={6}>
                Gerenciar Clientes
            </Heading>
            <FormAdminCadastraCliente />
        </Box>
    );
}
export default AdminClientes;