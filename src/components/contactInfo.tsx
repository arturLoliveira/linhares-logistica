
import { Box, HStack, Icon, Text, Link } from '@chakra-ui/react'; 
import type { ReactNode } from 'react'; 

interface ContactInfoProps {
    icon: ReactNode; 
    info: string;
    isLink?: boolean;
}

function ContactInfo({ icon, info, isLink = false }: ContactInfoProps) {
    
    const InfoContent = () => {
        if (isLink) {
            return (
                <Text as="h4" fontSize="md" fontWeight="medium">
                    <Link 
                        href={`mailto:${info}`} 
                        color="gray.700"
                        
                        _hover={{ textDecoration: 'none' }} 
                    >
                        {info}
                    </Link>
                </Text>
            );
        }

        return (
            <Text as="h4" fontSize="md" fontWeight="medium" color="gray.700">
                {info}
            </Text>
        );
    };
    
    return (
        <HStack spacing={3} align="center">
            <Box color="blue.500" fontSize="xl">{icon}</Box>
            <InfoContent />
        </HStack>
    )
}

export default ContactInfo;