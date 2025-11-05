import React from 'react';
import { 
    Box, 
    VStack, 
    Text 
} from '@chakra-ui/react';

interface buttonProps {
    icon: React.ReactNode;
    title: string;
}

function ContactButton({ icon, title }: buttonProps) {
    return(
       
        <Box
            p={2}
            bg="blue.50"
            borderRadius="md"
            _hover={{ bg: 'blue.100' }}
            cursor="pointer"
            minW="110px" 
        >
            <VStack spacing={0}>
                <Box color="blue.500" fontSize="xl">
                    {icon}
                </Box>
                <Text fontSize="sm" fontWeight="medium" color="blue.700">
                    {title}
                </Text>
            </VStack>
        </Box>
    );
}
export default ContactButton;