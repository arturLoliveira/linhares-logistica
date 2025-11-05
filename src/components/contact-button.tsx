import React from 'react';
import { 
    Box, 
    VStack, 
    Text, // Usando Text para um controle mais fino
    Icon 
} from '@chakra-ui/react';

interface buttonProps {
    icon: React.ReactNode;
    title: string;
}

function ContactButton({ icon, title }: buttonProps) {
    return(
        // Estilizado para bater com a imagem image_447c81.jpg
        <Box
            p={2}
            bg="blue.50" // Fundo azul claro
            borderRadius="md"
            _hover={{ bg: 'blue.100' }}
            cursor="pointer"
            minW="110px" // Largura mínima para o layout
        >
            <VStack spacing={0}>
                {/* Ícone */}
                <Box color="blue.500" fontSize="xl">
                    {icon}
                </Box>
                {/* Título */}
                <Text fontSize="sm" fontWeight="medium" color="blue.700">
                    {title}
                </Text>
            </VStack>
        </Box>
    );
}
export default ContactButton;