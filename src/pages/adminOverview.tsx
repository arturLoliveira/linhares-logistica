import { useState, useEffect, useCallback } from 'react'; 
import { FaTruck, FaUndo, FaCheckDouble, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa'; 
import type { IconType } from 'react-icons'; 
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Spinner,
    Alert,
    AlertIcon,
    Center,
    HStack,
    VStack,
    Icon,
} from '@chakra-ui/react';

type StatusCounts = {
    PENDENTE: number;
    COLETADO: number;
    EM_TRANSITO: number;
    EM_ROTA_ENTREGA: number;
    CONCLUIDA: number;
    CANCELADA: number;
    EM_DEVOLUCAO: number;
    [key: string]: number; 
};

type StatsData = {
    coletasMes: number;         
    statusCounts: StatusCounts;
    faturamentoTotal: number;
};


function AdminOverview() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = useCallback(async () => {
        const token = localStorage.getItem('admin_token');
        setIsLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        try {
            const response = await fetch(`${API_URL}/api/admin/stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar estatísticas.');
            }
            
            const data: StatsData = await response.json();
            
            setStats(data); 
            
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchStats();
    }, [fetchStats]); 
    
    const formatCurrency = (value: number) => {
        const numericValue = isNaN(value) || value === null ? 0 : value;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue);
    };

    const getStatusCount = (status: keyof StatusCounts) => stats?.statusCounts?.[status] || 0;

    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={2}>
                Dashboard
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
                Seja bem-vindo ao painel de administração.
            </Text>
            
            <Box>
                {isLoading ? (
                    <Center p={10}>
                        <Spinner size="xl" />
                    </Center>
                ) : error ? (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                ) : stats ? (
                    <SimpleGrid columns={{ base: 1, md: 4, sm:2, lg:4 }} spacing={6}>
                        
                        <StatBox
                            label="Coletas Cadastradas no Mês"
                            value={stats.coletasMes}
                            icon={FaCalendarAlt} 
                        />
                        
                        <StatBox
                            label="Faturamento Total (Concluídas)"
                            value={formatCurrency(stats.faturamentoTotal)}
                            icon={FaMoneyBillWave} 
                        />
                        
                        <StatBox
                            label="Coletas em Aberto"
                            value={getStatusCount('PENDENTE') + 
                                    getStatusCount('EM_TRANSITO') + 
                                    getStatusCount('EM_ROTA_ENTREGA') + 
                                    getStatusCount('COLETADO')} 
                            icon={FaTruck} 
                        />
                        
                        <StatBox
                            label="Em Devolução"
                            value={getStatusCount('EM_DEVOLUCAO')}
                            icon={FaUndo}
                        />
                        
                        <StatBox
                            label="Coletas Concluídas"
                            value={getStatusCount('CONCLUIDA')}
                            icon={FaCheckDouble}
                        />
                        
                    </SimpleGrid>
                ) : null}
            </Box>
            
            <Text fontSize="lg" color="gray.600" mt={8}>
                Use o menu ao lado para gerenciar as operações do sistema.
            </Text>
        </Box>
    );
}

function StatBox({ label, value, icon }: { label: string, value: number | string, icon: IconType }) {
    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <HStack spacing={4} align="center">
                <Icon as={icon} boxSize={12} color="blue.500" />
                <VStack align="flex-start" spacing={0}>
                    <Text fontSize="md" color="gray.500">{label}</Text>
                    <Text fontSize="4xl" fontWeight="bold">{value}</Text>
                </VStack>
            </HStack>
        </Box>
    );
}

export default AdminOverview;