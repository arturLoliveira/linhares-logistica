import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useToast,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    InputGroup,
    InputLeftAddon,
    Select,
    VStack
} from '@chakra-ui/react';

interface ColetaParaEdicao {
    id: number;
    numeroEncomenda: string;
    numeroNotaFiscal: string;
    nomeCliente: string;
    emailCliente: string;
    enderecoColeta: string;
    tipoCarga: string | null;
    cpfCnpjRemetente: string;
    cpfCnpjDestinatario: string;
    valorFrete: number;
    pesoKg: number | null;
    status: string; 
    dataVencimento: string | null; 
}

interface EditarColetaModalProps {
    isOpen: boolean;
    coleta: ColetaParaEdicao;
    onClose: () => void;
    onSuccess: () => void;
}

const EditarColetaModal: React.FC<EditarColetaModalProps> = ({ isOpen, coleta, onClose, onSuccess }) => {
    
    const [formData, setFormData] = useState({
        ...coleta,
        dataVencimento: coleta.dataVencimento ? coleta.dataVencimento.split('T')[0] : '', 
        valorFrete: String(coleta.valorFrete),
        pesoKg: coleta.pesoKg !== null ? String(coleta.pesoKg) : '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (name: keyof typeof formData, valueString: string) => {
        setFormData(prev => ({ ...prev, [name]: valueString }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('admin_token');
        
        const dadosParaBackend = {
            ...formData,
            valorFrete: parseFloat(formData.valorFrete),
            pesoKg: formData.pesoKg ? parseFloat(formData.pesoKg) : null,
        };

        try {
            const response = await fetch(`${API_URL}/api/admin/coletas/${coleta.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(dadosParaBackend),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao atualizar a coleta.');
            }
            
            toast({
                title: 'Sucesso!',
                description: `Coleta #${coleta.id} atualizada com sucesso.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onSuccess(); 
        } catch (error) {
            toast({
                title: 'Erro na Edição.',
                description: (error as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const statusOptions = [
        'PENDENTE', 'COLETADO', 'EM_TRANSITO', 'EM_ROTA_ENTREGA', 
        'CONCLUIDA', 'CANCELADA', 'EM_DEVOLUCAO'
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit}>
                <ModalHeader>Editar Coleta #{coleta.numeroEncomenda}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Select 
                                    name="status"
                                    value={formData.status} 
                                    onChange={handleChange}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <FormControl isRequired>
                                <FormLabel>Valor do Frete (R$)</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon>R$</InputLeftAddon>
                                    <NumberInput 
                                        value={formData.valorFrete} 
                                        onChange={(val) => handleNumberChange('valorFrete', val)}
                                        precision={2}
                                        min={0.01}
                                        w="100%"
                                    >
                                        <NumberInputField name="valorFrete" />
                                    </NumberInput>
                                </InputGroup>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>CPF/CNPJ Destinatário</FormLabel>
                                <Input 
                                    name="cpfCnpjDestinatario"
                                    value={formData.cpfCnpjDestinatario} 
                                    onChange={handleChange} 
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Peso (Kg)</FormLabel>
                                <NumberInput 
                                    value={formData.pesoKg} 
                                    onChange={(val) => handleNumberChange('pesoKg', val)}
                                    precision={1}
                                    step={0.5}
                                    min={0}
                                >
                                    <NumberInputField name="pesoKg" placeholder="Opcional" />
                                </NumberInput>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Data de Vencimento</FormLabel>
                                <Input 
                                    name="dataVencimento"
                                    type="date" 
                                    value={formData.dataVencimento} 
                                    onChange={handleChange} 
                                />
                            </FormControl>
                        </VStack>
                        
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Nome do Cliente (Remetente)</FormLabel>
                                <Input 
                                    name="nomeCliente"
                                    value={formData.nomeCliente} 
                                    onChange={handleChange} 
                                />
                            </FormControl>
                            
                            <FormControl isRequired>
                                <FormLabel>E-mail do Cliente</FormLabel>
                                <Input 
                                    name="emailCliente"
                                    type="email" 
                                    value={formData.emailCliente} 
                                    onChange={handleChange} 
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Endereço de Coleta</FormLabel>
                                <Input 
                                    name="enderecoColeta"
                                    value={formData.enderecoColeta} 
                                    onChange={handleChange} 
                                />
                            </FormControl>
                            
                            <FormControl isRequired>
                                <FormLabel>CPF/CNPJ Remetente</FormLabel>
                                <Input 
                                    name="cpfCnpjRemetente"
                                    value={formData.cpfCnpjRemetente} 
                                    onChange={handleChange} 
                                />
                            </FormControl>
                            
                            <FormControl isRequired>
                                <FormLabel>Número da Nota Fiscal</FormLabel>
                                <Input 
                                    name="numeroNotaFiscal"
                                    value={formData.numeroNotaFiscal} 
                                    onChange={handleChange} 
                                />
                            </FormControl>
                        </VStack>
                    
                    </SimpleGrid>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        colorScheme="orange" 
                        type="submit" 
                        isLoading={isLoading}
                        loadingText="Salvando..."
                    >
                        Salvar Alterações
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditarColetaModal;