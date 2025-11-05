import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaSearch } from 'react-icons/fa';

import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    useToast,
    VStack,
    HStack,
    IconButton,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    SimpleGrid,
    InputGroup,
    InputLeftAddon,
    NumberInput,
    NumberInputField
} from '@chakra-ui/react';

function ListaColetas() {
    type Coleta = {
        id: number;
        numeroEncomenda: string;
        numeroNotaFiscal: string;
        nomeCliente: string;
        cpfCnpjDestinatario: string;
        status: string;
        valorFrete: number;
        driverToken: string;
        pesoKg: number | null;
    };

    type PaginationData = {
        totalCount: number;
        pageSize: number;
        currentPage: number;
        totalPages: number;
    };

    const [coletas, setColetas] = useState<Coleta[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');

    const [filtroStatus, setFiltroStatus] = useState('PENDENTE');
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [qrCodeVisivel, setQrCodeVisivel] = useState<string | null>(null);
    const [driverTokenVisivel, setDriverTokenVisivel] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://transportelinhares.vercel.app';


    useEffect(() => {
        const fetchColetas = async () => {
            const token = localStorage.getItem('admin_token');
            setIsLoading(true);
            setErro('');

            const url = `${API_URL}/api/admin/coletas?status=${filtroStatus}&page=${currentPage}&search=${searchQuery}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao buscar coletas.');

                const data = await response.json();
                setColetas(data.coletas);
                setPagination(data.pagination);

            } catch (err) {
                setErro((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchColetas();
    }, [filtroStatus, currentPage, searchQuery, API_URL]);

    const handlePrint = () => {
        window.print();
    };

    const handleFiltroStatusChange = (status: string) => {
        setFiltroStatus(status);
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchQuery(searchTerm);
    };

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

    const handleOpenModal = (coleta: Coleta) => {
        setQrCodeVisivel(coleta.numeroEncomenda);
        setDriverTokenVisivel(coleta.driverToken);
    };

    const handleCloseModal = () => {
        setQrCodeVisivel(null);
        setDriverTokenVisivel(null);
    };

    return (
        <Box w="100%">
            <Heading as="h4" size="md" mb={4}>Visualizar Coletas</Heading>

            <HStack spacing={2} wrap="wrap" mb={4}>
                <Button variant={filtroStatus === 'PENDENTE' ? 'solid' : 'outline'} colorScheme="blue" onClick={() => handleFiltroStatusChange('PENDENTE')}>Pendentes</Button>
                <Button variant={filtroStatus === 'COLETADO' ? 'solid' : 'outline'} colorScheme="blue" onClick={() => handleFiltroStatusChange('COLETADO')}>Coletados</Button>
                <Button variant={filtroStatus === 'EM_TRANSITO' ? 'solid' : 'outline'} colorScheme="blue" onClick={() => handleFiltroStatusChange('EM_TRANSITO')}>Em Trânsito</Button>
                <Button variant={filtroStatus === 'EM_ROTA_ENTREGA' ? 'solid' : 'outline'} colorScheme="blue" onClick={() => handleFiltroStatusChange('EM_ROTA_ENTREGA')}>Em Rota</Button>
                <Button variant={filtroStatus === 'CONCLUIDA' ? 'solid' : 'outline'} colorScheme="blue" onClick={() => handleFiltroStatusChange('CONCLUIDA')}>Concluídas</Button>
                <Button variant={filtroStatus === '' ? 'solid' : 'outline'} colorScheme="blue" onClick={() => handleFiltroStatusChange('')}>Ver Todas</Button>
            </HStack>

            <HStack as="form" onSubmit={handleSearchSubmit} mb={4} w="100%">
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por Nº Encomenda, NF, Cliente..."
                />
                <IconButton
                    aria-label="Buscar"
                    icon={<FaSearch />}
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                />
            </HStack>

            {isLoading && (
                <Box textAlign="center" p={10}>
                    <Spinner size="xl" />
                    <Text mt={2}>Carregando coletas...</Text>
                </Box>
            )}

            {erro && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {erro}
                </Alert>
            )}

            {!isLoading && !erro && coletas.length === 0 && (
                <Text>Nenhuma coleta encontrada.</Text>
            )}

            {!isLoading && !erro && coletas.length > 0 && (
                <Box overflowX="auto" bg="white" shadow="sm" borderRadius="md">
                    <TableContainer>
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Encomenda</Th>
                                    <Th>NF</Th>
                                    <Th>Cliente</Th>
                                    <Th isNumeric>Valor (R$)</Th>
                                    <Th isNumeric>Peso (Kg)</Th>
                                    <Th>Status</Th>
                                    <Th>Ações</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {coletas.map((coleta) => (
                                    <Tr key={coleta.id}>
                                        <Td>{coleta.numeroEncomenda}</Td>
                                        <Td>{coleta.numeroNotaFiscal}</Td>
                                        <Td>{coleta.nomeCliente}</Td>
                                        <Td isNumeric>{coleta.valorFrete.toFixed(2)}</Td>
                                        <Td isNumeric>
                                            {coleta.pesoKg ? `${coleta.pesoKg.toFixed(1)}` : 'N/A'}
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={getStatusColor(coleta.status)}>
                                                {coleta.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Button
                                                size="xs"
                                                onClick={() => handleOpenModal(coleta)}
                                            >
                                                Ver QR Code
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {pagination && pagination.totalPages > 1 && (
                <HStack justifyContent="space-between" mt={4}>
                    <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                        size="sm"
                    >
                        Anterior
                    </Button>
                    <Text fontSize="sm">
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </Text>
                    <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= pagination.totalPages || isLoading}
                        size="sm"
                    >
                        Próxima
                    </Button>
                </HStack>
            )}

            <Modal isOpen={qrCodeVisivel !== null} onClose={handleCloseModal} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <Box id="printable-qr-code">
                        <ModalHeader>QR Code para Encomenda {qrCodeVisivel}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody textAlign="center">
                            <Text mb={4}>Imprima e cole na etiqueta. O motorista deve escanear este código.</Text>

                            <QRCodeSVG
                                value={`${FRONTEND_URL}/driver/update?id=${qrCodeVisivel}&token=${driverTokenVisivel}`}
                                size={256}
                                style={{ margin: '0 auto', display: 'block' }}
                            />
                        </ModalBody>
                    </Box>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                            Fechar
                        </Button>
                        <Button colorScheme="blue" onClick={handlePrint}>Imprimir</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}


function FormAdminCadastraColeta() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [enderecoColeta, setEnderecoColeta] = useState('');
    const [tipoCarga, setTipoCarga] = useState('');
    const [cpfCnpjRemetente, setCpfCnpjRemetente] = useState('');
    const [cpfCnpjDestinatario, setCpfCnpjDestinatario] = useState('');
    const [numeroNotaFiscal, setNumeroNotaFiscal] = useState('');
    const [valorFrete, setValorFrete] = useState('');
    const [pesoKg, setPesoKg] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmitColeta = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const dadosColeta = {
            nomeCliente, emailCliente, enderecoColeta, tipoCarga,
            cpfCnpjRemetente, cpfCnpjDestinatario, numeroNotaFiscal,
            valorFrete, pesoKg: pesoKg || null, dataVencimento: dataVencimento || null
        };
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';
            const response = await fetch(`${API_URL}/api/coletas/solicitar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosColeta),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao cadastrar a coleta.');
            }
            const novaColeta = await response.json();

            toast({
                title: 'Coleta cadastrada!',
                description: `Nº Encomenda: ${novaColeta.numeroEncomenda}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setNomeCliente(''); setEmailCliente(''); setEnderecoColeta(''); setTipoCarga('');
            setCpfCnpjRemetente(''); setCpfCnpjDestinatario(''); setNumeroNotaFiscal('');
            setValorFrete(''); setPesoKg(''); setDataVencimento('');

        } catch (error) {
            toast({
                title: 'Erro ao cadastrar.',
                description: (error as Error).message,
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
            onSubmit={handleSubmitColeta}
            mt="40px"
            borderTopWidth="1px"
            borderColor="gray.200"
            pt="40px"
        >
            <Heading as="h4" size="md" mb={1}>Cadastrar Nova Coleta</Heading>
            <Text mb={6}>O funcionário preenche estes dados quando a carga é recebida.</Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>

                {/* Coluna 1 */}
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Valor do Frete (R$)</FormLabel>
                        <InputGroup>
                            <InputLeftAddon>R$</InputLeftAddon>
                            <NumberInput
                                value={valorFrete}
                                onChange={(valueString) => setValorFrete(valueString)}
                                precision={2}
                                min={0.01}
                                w="100%"
                            >
                                <NumberInputField placeholder="Ex: 150.00" />
                            </NumberInput>
                        </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Número da Nota Fiscal</FormLabel>
                        <Input value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>CPF/CNPJ Remetente</FormLabel>
                        <Input value={cpfCnpjRemetente} onChange={(e) => setCpfCnpjRemetente(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>CPF/CNPJ Destinatário</FormLabel>
                        <Input value={cpfCnpjDestinatario} onChange={(e) => setCpfCnpjDestinatario(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Peso (Kg) (Opcional)</FormLabel>
                        <NumberInput
                            value={pesoKg}
                            onChange={(valueString) => setPesoKg(valueString)}
                            precision={1}
                            step={0.5}
                            min={0}
                        >
                            <NumberInputField placeholder="Ex: 25.5" />
                        </NumberInput>
                    </FormControl>
                </VStack>

                {/* Coluna 2 */}
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Nome do Cliente (Remetente)</FormLabel>
                        <Input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>E-mail do Cliente (Remetente)</FormLabel>
                        <Input type="email" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Endereço de Coleta</FormLabel>
                        <Input value={enderecoColeta} onChange={(e) => setEnderecoColeta(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Tipo da Carga (Opcional)</FormLabel>
                        <Input value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)} placeholder="Ex: Caixas, Pallets" />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Data de Vencimento (Opcional)</FormLabel>
                        <Input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
                    </FormControl>
                </VStack>

            </SimpleGrid>

            <Button
                type="submit"
                colorScheme="blue"
                mt={6}
                isLoading={isLoading}
                loadingText="Salvando..."
            >
                Salvar Coleta
            </Button>
        </Box>
    );
}

function FormAdminAdicionaHistorico() {
    const [notaFiscal, setNotaFiscal] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [novoStatus, setNovoStatus] = useState('EM_TRANSITO');
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const handleAddHistorico = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');
        const API_URL = import.meta.env.VITE_API_URL || 'https://linhares-logistica-backend.onrender.com';

        try {
            const response = await fetch(`${API_URL}/api/admin/coletas/${notaFiscal}/historico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: novoStatus, localizacao: localizacao })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao adicionar histórico.');
            }

            toast({
                title: 'Sucesso!',
                description: 'Histórico adicionado. (A lista será atualizada no próximo recarregamento)',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setNotaFiscal('');
            setLocalizacao('');

        } catch (err) {
            toast({
                title: 'Erro ao adicionar histórico.',
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
            onSubmit={handleAddHistorico}
            mt="40px"
            borderTopWidth="1px"
            borderColor="gray.200"
            pt="40px"
        >
            <Heading as="h4" size="md" mb="20px">Adicionar Evento de Rastreio</Heading>

            <FormControl id="nf_status" isRequired mb="16px">
                <FormLabel>Número da Nota Fiscal</FormLabel>
                <Input
                    value={notaFiscal}
                    onChange={(e) => setNotaFiscal(e.target.value)}
                    placeholder="NF da coleta que será atualizada"
                />
            </FormControl>

            <FormControl id="localizacao" isRequired mb="16px">
                <FormLabel>Localização Atual</FormLabel>
                <Input
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Ex: Centro de Distribuição - BH/MG"
                />
            </FormControl>

            <FormControl id="status" isRequired mb="24px">
                <FormLabel>Novo Status</FormLabel>
                <Select
                    value={novoStatus}
                    onChange={(e) => setNovoStatus(e.target.value)}
                >
                    <option value="COLETADO">Coletado</option>
                    <option value="EM_TRANSITO">Em Trânsito</option>
                    <option value="EM_ROTA_ENTREGA">Em Rota de Entrega</option>
                    <option value="CONCLUIDA">Concluída</option>
                    <option value="CANCELADA">Cancelada</option>
                    <option value="EM_DEVOLUCAO">Em Devolução</option>
                </Select>
            </FormControl>

            <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Adicionando..."
            >
                Adicionar Evento
            </Button>
        </Box>
    );
}

function AdminColetas() {
    return (
        <Box w="100%" p={4}>
            <Heading as="h2" size="lg" mb={6}>
                Gerenciar Coletas
            </Heading>

            <VStack spacing={10} align="stretch">
                <ListaColetas />
                <FormAdminCadastraColeta />
                <FormAdminAdicionaHistorico />
            </VStack>
        </Box>
    );
}
export default AdminColetas;