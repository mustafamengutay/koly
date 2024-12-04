import { Box, IconButton, Stack, Text } from '@chakra-ui/react';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaGithub } from 'react-icons/fa';

export default function MobileActionMenu() {
  return (
    <Box display={{ lg: 'none' }}>
      <DrawerRoot size='full'>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Button variant='outline' size='sm'>
            <RxHamburgerMenu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody marginLeft='12' marginRight='12'>
            <Stack gap='4'>
              <Button variant='outline'>Sign in</Button>
              <Button>Sign up</Button>
              <IconButton variant='outline'>
                <FaGithub />
                Github
              </IconButton>
            </Stack>
          </DrawerBody>
          <DrawerFooter display='flex' justifyContent='center'>
            <Text>2024. koly.</Text>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
}
