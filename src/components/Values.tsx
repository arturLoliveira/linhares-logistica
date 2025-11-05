import { FaSitemap, FaTags, FaTruckMoving, FaUsers } from "react-icons/fa";
import valuesImage from "../assets/values.jpg"; 
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Image,
    VStack, 
    Icon
} from '@chakra-ui/react';

function Values() {
    return (
        <Box as="section" w="100%" py={16} bg="white"> 
            <Heading as="h2" size="xl" textAlign="center" mb={10} maxW="600px" mx="auto" color="blue.700">
                Compromisso em cada detalhe,
                <Text as="span" color="blue.500" fontWeight="extrabold" display="block">
                    da cotação ao destino final.
                </Text>
            </Heading>

            <SimpleGrid 
                columns={{ base: 1, md: 2 }} 
                spacing={10} 
                maxW="1200px" 
                mx="auto" 
                alignItems="center"
                px={4}
            >
                <Box>
                    <Image 
                      src={valuesImage} 
                      alt="Equipe de logística trabalhando" 
                      borderRadius="md" 
                      shadow="lg"
                    />
                </Box>

                <SimpleGrid columns={2} spacing={5}>
                    <FeatureCard icon={FaUsers} text="Atendimento Especializado" isPrimary />
                    <FeatureCard icon={FaTruckMoving} text="Motoristas capacitados" />
                    <FeatureCard icon={FaSitemap} text="Plano de logística personalizado" />
                    <FeatureCard icon={FaTags} text="Atendimento exclusivo" isPrimary />
                </SimpleGrid>
            </SimpleGrid>
        </Box>
    )
}

function FeatureCard({ icon, text, isPrimary = false }: any) {
    
    const styles = isPrimary 
        ? { bg: 'blue.500', color: 'white' } 
        : { bg: 'white', color: 'blue.500' };

    return (
        <VStack
            spacing={3}
            p={6}
            borderRadius="md"
            shadow="md" 
            borderWidth={isPrimary ? "0" : "1px"}
            borderColor="gray.200"
            justifyContent="center" 
            alignItems="center" 
            minH="150px" 
            {...styles} 
        >
            <Icon as={icon} boxSize={8} />
            <Text fontWeight="medium" textAlign="center">{text}</Text>
        </VStack>
    );
}

export default Values;