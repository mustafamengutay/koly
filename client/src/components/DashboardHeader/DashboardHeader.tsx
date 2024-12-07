import { Box, Flex } from '@chakra-ui/react';
import Logo from '../Header/Logo';

import DashboardNavigation from './DashboardNavigation';
import DashboardActions from './DashboardActions';
import DashboardMobileActionMenu from './MobileActionMenu';

export default function DashboardHeader() {
  return (
    <Box as='header'>
      <Box
        borderStyle='solid'
        display={{ base: 'flex', md: 'grid' }}
        gridTemplateColumns='repeat(3, 1fr)'
        justifyContent={{ base: 'space-between' }}
        alignItems='center'
      >
        <Box justifySelf='left' gridColumnStart='1'>
          <Logo />
        </Box>

        <Box justifySelf='center' gridColumnStart='2'>
          <DashboardNavigation />
        </Box>

        <Flex
          justifySelf='right'
          gridColumnStart='3'
          gap='4'
          alignItems='center'
        >
          <DashboardActions />
          <DashboardMobileActionMenu />
        </Flex>
      </Box>
    </Box>
  );
}
