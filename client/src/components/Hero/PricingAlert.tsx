import { Text } from '@chakra-ui/react';

export default function PricingAlert() {
  return (
    <Text
      bgColor='gray.100'
      boxSize='fit-content'
      paddingTop='2'
      paddingRight='4'
      paddingBottom='2'
      paddingLeft='4'
      borderRadius='full'
    >
      Check out pricing ↗️
    </Text>
  );
}
