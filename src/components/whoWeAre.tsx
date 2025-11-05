
import WhoWeAreImg from '../assets/whoeweare.jpg'; 
import {
    Box,
    Heading,
    Text,
    Image,
    SimpleGrid,
    VStack
} from '@chakra-ui/react';

function WhoWeAre() {
  return (
    <Box as="section" w="100%" py={16} bg="white"> 
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
            src={WhoWeAreImg} 
            alt="Equipe Transportes Linhares em reunião" 
            borderRadius="md" 
            shadow="lg" 
            objectFit="cover" 
            w="100%" 
            h="300px" 
          />
        </Box>
        
        <VStack spacing={4} align="flex-start">
          <Heading as="h2" size="xl" color="blue.700"> 
            Quem Somos
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Há mais de 22 anos, a <strong>Transportes Linhares</strong> é sinônimo de transporte de cargas com segurança e agilidade.
          </Text>
          <Text fontSize="lg" color="gray.600">
            Somos especialistas em logística integrada, conectando dezenas de municípios na região central de Minas Gerais para garantir que sua entrega chegue no prazo, com a confiança que seu negócio merece.
          </Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}

export default WhoWeAre;