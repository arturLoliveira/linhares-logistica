import { 
    Box, 
    SimpleGrid, 
    VStack 
} from '@chakra-ui/react';

import Boxes from '../components/boxes';
import { MdOutlineInventory } from 'react-icons/md';
import { TbTruckDelivery } from 'react-icons/tb';
import { FaShippingFast } from 'react-icons/fa';
import Landing from '../components/Landing';
import CoverageMap from '../components/coverageMap';
import WhoWeAre from '../components/whoWeAre';
import Values from '../components/Values';
import ContactUs from '../components/contact-us';

function HomePage() {
  return (
    <VStack spacing={0} align="stretch">
      <Landing />
      <Box 
        w="100%" 
        py={{ base: 10, md: 16 }} 
        px={{ base: 6, md: 10 }} 
        bg="gray.50"

        mt={{ base: 0, md: "-80px" }}
        position="relative" 
        zIndex={10} 
      >
        <SimpleGrid 
            columns={{ base: 1, md: 3 }} 
            spacing={{ base: 6, md:20 }} 
            maxW="1200px" 
            mx="auto" 
        >
          <Boxes
            icon={<MdOutlineInventory fontSize={40} />}
            title="Carga dedicada"
            description="Um veículo exclusivo para sua entrega, garantindo agilidade máxima da coleta ao destino final."
          />
          <Boxes
            icon={<TbTruckDelivery fontSize={45} />}
            title="Carga Fracionada"
            description="A solução inteligente e com melhor custo-benefício para enviar volumes menores."
          />
          <Boxes
            icon={<FaShippingFast fontSize={45} />}
            title="Entregas Expressas"
            description="Sua carga urgente é nossa prioridade. Atendemos demandas com prazo crítico (consulte regiões)."
          />
        </SimpleGrid>
      </Box>

      <CoverageMap />
      <WhoWeAre />
      <Values />
      <ContactUs />
    </VStack>
  );
}

export default HomePage;