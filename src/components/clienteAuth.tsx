import React, { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
    Link,
    Center
} from '@chakra-ui/react';

interface ClienteAuthProps {
    onLoginSuccess: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

const LoginForm: React.FC<{ onSwitchToRegister: () => void, onLoginSuccess: () => void }> = ({ onSwitchToRegister, onLoginSuccess }) => {
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/cliente/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpfCnpj, senha }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao tentar login.');
            }

            const data = await res.json();
            localStorage.setItem('cliente_token', data.token);
            
            toast({
                title: 'Sucesso!',
                description: 'Login realizado. Bem-vindo(a) à Área do Cliente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onLoginSuccess();

        } catch (error) {
            toast({
                title: 'Falha no Login.',
                description: (error as Error).message === 'Credenciais inválidas.' 
                    ? 'CPF/CNPJ ou senha incorretos.' 
                    : (error as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box as="form" onSubmit={handleLogin} p={8} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="lg">
            <Heading as="h3" size="lg" mb={6} textAlign="center">Acessar Minha Conta</Heading>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <Input type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} placeholder="Seu CPF ou CNPJ" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input type="password" value={senha} onChange={e => setSenha(e.target.value)} />
                </FormControl>
                <Button type="submit" colorScheme="blue" size="lg" w="100%" mt={4} isLoading={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
            </VStack>
            <Text mt={4} textAlign="center">
                Não tem cadastro?{' '}
                <Link color="blue.500" onClick={onSwitchToRegister}>Crie sua conta aqui.</Link>
            </Text>
        </Box>
    );
};

const RegisterForm: React.FC<{ onSwitchToLogin: () => void, onLoginSuccess: () => void }> = ({ onSwitchToLogin }) => {
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/cliente/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpfCnpj, senha, nome, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao tentar cadastrar.');
            }
            
            toast({
                title: 'Cadastro Efetuado!',
                description: 'Você pode fazer login agora.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onSwitchToLogin();
        } catch (error) {
            toast({
                title: 'Falha no Cadastro.',
                description: (error as Error).message === 'CPF/CNPJ já cadastrado.' 
                    ? 'Este CPF/CNPJ já possui um cadastro.' 
                    : (error as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box as="form" onSubmit={handleRegister} p={8} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="lg">
            <Heading as="h3" size="lg" mb={6} textAlign="center">Criar Nova Conta</Heading>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <Input type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} placeholder="Seu CPF ou CNPJ" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Crie uma senha forte" />
                </FormControl>
                <FormControl>
                    <FormLabel>Nome Completo</FormLabel>
                    <Input type="text" value={nome} onChange={e => setNome(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>E-mail</FormLabel>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </FormControl>
                <Button type="submit" colorScheme="blue" size="lg" w="100%" mt={4} isLoading={isLoading}>
                    {isLoading ? 'Registrando...' : 'Finalizar Cadastro'}
                </Button>
            </VStack>
            <Text mt={4} textAlign="center">
                Já tem conta?{' '}
                <Link color="blue.500" onClick={onSwitchToLogin}>Acesse aqui.</Link>
            </Text>
        </Box>
    );
};


const ClienteAuth: React.FC<ClienteAuthProps> = ({ onLoginSuccess }) => {
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    return (
        <Center minH="70vh" p={4}>
            <Box maxW="sm" w="100%">
                {isRegisterMode ? (
                    <RegisterForm 
                        onSwitchToLogin={() => setIsRegisterMode(false)}
                        onLoginSuccess={onLoginSuccess}
                    />
                ) : (
                    <LoginForm 
                        onSwitchToRegister={() => setIsRegisterMode(true)}
                        onLoginSuccess={onLoginSuccess}
                    />
                )}
            </Box>
        </Center>
    );
};

export default ClienteAuth;