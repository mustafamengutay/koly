import {
  Box,
  IconButton,
  Stack,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
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
import { Link } from 'react-router';

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
              <Link to='/login'>
                <Button variant='outline' width='full' borderRadius='lg'>
                  Login
                </Button>
              </Link>
              <Link to='/signup'>
                <Button width='full' borderRadius='lg'>
                  Sign up
                </Button>
              </Link>
              <ChakraLink
                href='https://github.com/mustafamengutay/koly'
                target='_blank'
              >
                <IconButton width='full' variant='outline' borderRadius='lg'>
                  <FaGithub />
                  Github
                </IconButton>
              </ChakraLink>
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
