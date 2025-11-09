import React, { useState } from 'react';
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
    Center,
    Text,
    useToast
} from '@chakra-ui/react';

const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

function RecuperarSenhaPage() {
    const [step, setStep] = useState(1); 
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');
    const toast = useToast();


    const handleSolicitarCodigo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErro('');

        try {
            const response = await fetch(`${API_URL}/api/clientes/solicitar-recuperacao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cpfCnpj })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao solicitar código.');
            }

            toast({
                title: 'Verifique seu E-mail!',
                description: data.message,
                status: 'info',
                duration: 7000,
                isClosable: true,
            });
            setStep(2); 

        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRedefinirSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErro('');

        if (novaSenha.length < 6) {
            setErro("A nova senha deve ter no mínimo 6 caracteres.");
            setIsLoading(false);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/clientes/redefinir-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, novaSenha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha na redefinição.');
            }

            toast({
                title: 'Sucesso!',
                description: data.message,
                status: 'success',
                duration: 9000,
                isClosable: true,
            }); 

        } catch (err) {
            setErro((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Center minH="80vh" p={4}>
            <Box
                w={{ base: '90%', md: '450px' }}
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    Recuperação de Senha (Passo {step} de 2)
                </Heading>
                
                {erro && (
                    <Alert status="error" borderRadius="md" mb={4}>
                        <AlertIcon />
                        {erro}
                    </Alert>
                )}

                {step === 1 && (
                    <Box as="form" onSubmit={handleSolicitarCodigo}>
                        <VStack spacing={4}>
                            <Text textAlign="center" mb={3}>
                                Digite seu CPF/CNPJ e E-mail para receber o código de segurança.
                            </Text>
                            
                            <FormControl id="email" isRequired>
                                <FormLabel>E-mail Cadastrado</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu.email@exemplo.com"
                                />
                            </FormControl>
                            
                            <FormControl id="cpfCnpj" isRequired>
                                <FormLabel>CPF/CNPJ</FormLabel>
                                <Input
                                    type="text"
                                    value={cpfCnpj}
                                    onChange={(e) => setCpfCnpj(e.target.value)}
                                    placeholder="Apenas números ou formatado"
                                />
                            </FormControl>
                            
                            <Button type="submit" colorScheme="blue" width="100%" isLoading={isLoading} mt={4}>
                                Solicitar Código
                            </Button>
                        </VStack>
                    </Box>
                )}

                {step === 2 && (
                    <Box as="form" onSubmit={handleRedefinirSenha}>
                        <VStack spacing={4}>
                            <Text textAlign="center" mb={3}>
                                Insira o código de segurança enviado para **{email}** e sua nova senha.
                            </Text>
                            
                            <FormControl id="token" isRequired>
                                <FormLabel>Código de Segurança</FormLabel>
                                <Input
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Código recebido por e-mail"
                                />
                            </FormControl>

                            <FormControl id="novaSenha" isRequired>
                                <FormLabel>Nova Senha (Mín. 6 caracteres)</FormLabel>
                                <Input
                                    type="password"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                />
                            </FormControl>

                            <FormControl id="confirmarSenha" isRequired>
                                <FormLabel>Confirme a Nova Senha</FormLabel>
                                <Input
                                    type="password"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                />
                            </FormControl>
                            
                            <Button type="submit" colorScheme="blue" width="100%" isLoading={isLoading} mt={4}>
                                Redefinir Senha
                            </Button>
                        </VStack>
                    </Box>
                )}
            </Box>
        </Center>
    );
}

export default RecuperarSenhaPage;