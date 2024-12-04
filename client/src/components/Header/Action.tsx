import { Flex, IconButton, Link } from '@chakra-ui/react';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';

export default function Actions() {
  return (
    <Flex display={{ base: 'none', lg: 'flex' }} gap='2'>
      <Button variant='ghost'>Sign in</Button>
      <Button>Sign up</Button>
      <Link href='https://github.com/mustafamengutay/koly' target='_blank'>
        <IconButton variant='ghost'>
          <FaGithub />
        </IconButton>
      </Link>
    </Flex>
  );
}
