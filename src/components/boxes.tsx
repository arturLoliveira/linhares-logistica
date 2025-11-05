import { 
    Box, 
    VStack, 
    Heading, 
    Text 
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface BoxItemProps {
    icon: ReactNode;
    title: string;
    description: string;
}

function Boxes({ icon, title, description }: BoxItemProps) {
    return (
        <Box
            bg="white"
            shadow="md"
            borderRadius="lg"
            p={{ base: 6, md: 8 }}
            textAlign="center"
            minH="300px" 
            minW="400px" 
            w="100%"
            display="flex"
            alignItems="center"
            mt={{base:0, md: -140}}
        >
            <VStack 
                spacing={3} 
                w="100%"
            >
                <Box color="blue.500">
                    {icon}
                </Box>
                <Heading 
                    as="h3" 
                    size="md" 
                    fontWeight="bold" 
                >
                    {title}
                </Heading>
                <Text 
                    color="gray.500" 
                >
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}

export default Boxes;