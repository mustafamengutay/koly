import { Box } from '@chakra-ui/react';
import Logo from './Logo';
import Navigation from './Navigation';
import Actions from './Action';
import MobileActionMenu from './MobileActionMenu';

export default function Header() {
  return (
    <Box as='header' marginTop='6'>
      <Box
        display={{ base: 'flex', lg: 'grid' }}
        justifyContent={{ base: 'space-between' }}
        gridTemplateColumns='repeat(3, 1fr)'
        alignItems='center'
        borderStyle='solid'
      >
        <Box justifySelf='left' gridColumnStart='1'>
          <Logo />
        </Box>

        <Box justifySelf='center' gridColumnStart='2'>
          <Navigation />
        </Box>

        <Box justifySelf='right' gridColumnStart='3'>
          <Actions />
          <MobileActionMenu />
        </Box>
      </Box>
    </Box>
  );
}
