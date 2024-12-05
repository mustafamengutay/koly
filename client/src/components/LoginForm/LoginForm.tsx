import { Card, Input } from '@chakra-ui/react';
import Logo from '../Header/Logo';
import { Field } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Link } from 'react-router';

export default function LoginForm() {
  return (
    <Card.Root as='form' borderRadius='lg' width='24rem'>
      <Card.Body gap='4' alignItems='center'>
        <Logo />
        <Card.Description>Log in to continue to koly</Card.Description>
        <Field label='Email' required>
          <Input
            padding='6'
            placeholder='example@email.com'
            borderRadius='lg'
          />
        </Field>

        <Field label='Password' required>
          <PasswordInput padding='6' placeholder='password' borderRadius='lg' />
        </Field>
      </Card.Body>
      <Card.Footer gap='4' justifyContent='center' flexDirection='column'>
        <Button
          variant='solid'
          padding='6'
          size='md'
          width='full'
          borderRadius='lg'
        >
          Login
        </Button>
        <Link to='/signup' style={{ width: '100%' }}>
          <Button
            variant='outline'
            padding='6'
            size='md'
            width='full'
            borderRadius='lg'
          >
            Create an account
          </Button>
        </Link>
      </Card.Footer>
    </Card.Root>
  );
}
