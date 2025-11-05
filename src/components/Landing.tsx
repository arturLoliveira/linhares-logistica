import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    VStack 
} from '@chakra-ui/react';

import heroImageUrl from '../assets/caminhao.jpg';

const HERO_IMAGE_URL = `url(${heroImageUrl})`;

function Landing() {
    return(
         <Box
            as="section"
            w="100%"
            h={{ base: '55vh', md: '65vh' }} 
            minH="600px" 
            position="relative" 
            bgImage={HERO_IMAGE_URL}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            display="flex"
            alignItems="center"
            justifyContent="center" 
            bgAttachment="fixed" 
         >
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.600"
                zIndex={1}
            />
            
            <Container 
                maxW="container.lg" 
                position="relative" 
                zIndex={2} 
            >
                <VStack 
                    spacing={6} 
                    align="center" 
                    textAlign="center" 
                    maxW="650px"
                    mx="auto"
                >
                    <Heading 
                        as="h1" 
                        size={{ base: 'xl', md: '3xl' }}
                        color="white"
                    >
                        Sua carga, nossa prioridade.
                    </Heading>
                    <Text 
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="gray.200"
                    >
                      Mais do que uma transportadora, somos o parceiro logístico 
                      que sua empresa precisa para crescer. Entregas em toda 
                      região central de Minas Gerais com a agilidade que o 
                      seu negócio exige.
                    </Text>
                </VStack>
            </Container>
        </Box>
    )
}

export default Landing;