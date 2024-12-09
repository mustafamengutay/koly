import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router';
import {
  ProgressBar,
  ProgressLabel,
  ProgressRoot,
  ProgressValueText,
} from '../ui/progress';

export interface ProjectItemProps {
  id: string | number;
  name: string;
  description: string;
  percentageOfCompletion: number;
}

export default function ProjectItem({
  id,
  name,
  description,
  percentageOfCompletion,
}: ProjectItemProps) {
  return (
    <Link to={`/projects/${id}`}>
      <Box
        bgColor='#fdfdfd'
        borderWidth='thin'
        borderRadius='lg'
        padding='4'
        maxWidth='100%'
        height='10rem'
        overflow='hidden'
      >
        <Stack height='100%' gap='4' justifyContent='space-between'>
          <Flex flexDirection='column' gap='1' borderRadius='lg'>
            <Text fontSize='lg' fontWeight='semibold'>
              {name}
            </Text>
            <Text
              fontSize='xs'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {description}
            </Text>
          </Flex>
          <Box>
            <ProgressRoot
              value={percentageOfCompletion}
              defaultValue={1}
              size='sm'
              width='100%'
            >
              <ProgressBar flex='1' />
              <Flex
                marginTop='2'
                justifyContent='space-between'
                gap='2'
                alignItems='center'
              >
                <ProgressLabel fontSize='xs'>Completed Issues</ProgressLabel>
                <ProgressValueText fontSize='xs'>
                  {percentageOfCompletion}%
                </ProgressValueText>
              </Flex>
            </ProgressRoot>
          </Box>
        </Stack>
      </Box>
    </Link>
  );
}
