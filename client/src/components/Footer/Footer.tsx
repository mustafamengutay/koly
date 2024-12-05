import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const year = new Date().getFullYear();

  return (
    <Box
      as='footer'
      marginTop='20'
      marginBottom='6'
      color='gray.500'
      fontSize='sm'
      width='100%'
    >
      <Box
        display={{ base: 'flex', sm: 'grid' }}
        gridTemplateColumns='repeat(2, 1fr)'
        flexDirection={{ base: 'column' }}
        justifyContent={{ base: 'center' }}
        alignItems={{ base: 'center' }}
        gap='2'
      >
        <Text justifySelf='left' textWrap='nowrap'>
          © {year} koly. All rights reserved.
        </Text>
        <Text justifySelf='right'>
          Nicosia, {hours}.{minutes}
        </Text>
      </Box>
    </Box>
  );
}
