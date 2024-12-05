import { Box, Flex, Text } from '@chakra-ui/react';
import { Button } from '../ui/button';
import PricingAlert from './PricingAlert';

export default function Hero() {
  return (
    <Box as='section' marginTop='20'>
      <Flex
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        gap='10'
      >
        <Flex
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          gap='4'
        >
          <PricingAlert />
          <Text
            as='h1'
            fontWeight='medium'
            fontSize={{ base: '5xl', sm: '6xl' }}
            letterSpacing='tighter'
            lineHeight='shorter'
            textAlign='center'
          >
            Track all issues of your project easily
          </Text>
          <Text fontSize='xl'>Report issues to your team.</Text>
        </Flex>

        <Flex flexDirection={{ base: 'column', sm: 'row' }} gap='4'>
          <Button variant='outline' size='lg' borderRadius='lg'>
            Explore
          </Button>
          <Button size='lg' borderRadius='lg'>
            Start for free
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
