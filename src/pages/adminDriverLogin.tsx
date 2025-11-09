import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Alert,
    AlertIcon,
    Center
} from '@chakra-ui/react';

function AdminDriverLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState(''); 
    const [erro, setErro] = useState(''); 
    const navigate = useNavigate(); 
    const [searchParams] = useSearchParams();
    
    const redirectUrl = searchParams.get('redirect');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';
        try {
            const apiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
            const response = await fetch(`${apiUrl}/api/admin/login`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }) 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha no login');
            }

            localStorage.setItem('admin_token', data.token); 
            navigate(redirectUrl || '/driver/dashboard', { replace: true }); 

        } catch (err) {
            setErro((err as Error).message); 
        }
    };

    return (
        <Center minH="80vh">
            <Box
                w={{ base: '90%', md: '400px' }}
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    Login do Administrador
                </Heading>
                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} //
                            />
                        </FormControl>
                        <FormControl id="senha" isRequired>
                            <FormLabel>Senha</FormLabel>
                            <Input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)} //
                            />
                        </FormControl>
                        
                        {erro && (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                {erro}
                            </Alert>
                        )}

                        <Button type="submit" colorScheme="blue" width="100%">
                            Entrar
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </Center>
    );
}

export default AdminDriverLogin;