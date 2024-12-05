import { Flex, IconButton, Link as ChakraLink } from '@chakra-ui/react';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router';

export default function Actions() {
  return (
    <Flex display={{ base: 'none', lg: 'flex' }} gap='2'>
      <Link to='/login'>
        <Button variant='ghost' borderRadius='lg'>
          Login
        </Button>
      </Link>
      <Link to='/signup'>
        <Button borderRadius='lg'>Sign up</Button>
      </Link>
      <ChakraLink
        href='https://github.com/mustafamengutay/koly'
        target='_blank'
      >
        <IconButton variant='ghost' borderRadius='lg'>
          <FaGithub />
        </IconButton>
      </ChakraLink>
    </Flex>
  );
}
