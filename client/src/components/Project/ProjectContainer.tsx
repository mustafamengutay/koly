import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Button } from '../ui/button';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { SegmentedControl } from '../ui/segmented-control';
import ProjectList from './ProjectList';

export default function ProjectContainer() {
  const [projectFilter, setProjectFilter] = useState<string>('All');

  /**
   * TODO:
   * 1. Fetch projects
   * 2. Add an event to fetch filtered projects
   */

  // Temporary Data
  const projects = [
    {
      id: 1,
      name: 'koly',
      description: 'Project Management Tool',
      percentageOfCompletion: 32,
    },
    {
      id: 2,
      name: 'Depremzede',
      description: 'Earthquake Relief System',
      percentageOfCompletion: 89,
    },
  ];

  return (
    <Box>
      <Box>
        <Text
          mt='8'
          textAlign={{ base: 'center', sm: 'start' }}
          fontSize={{ base: '2xl', sm: '3xl' }}
          fontWeight='medium'
          letterSpacing='tighter'
        >
          Projects
        </Text>
      </Box>
      <Flex
        flexDirection={{ base: 'column-reverse', sm: 'row' }}
        justifyContent='space-between'
        alignItems='center'
        gap={{ base: '8' }}
        marginTop='8'
      >
        <Box>
          <SegmentedControl
            size='sm'
            value={projectFilter}
            onValueChange={(e) => setProjectFilter(e.value)}
            items={['All', 'Created', 'Participated']}
          />
        </Box>
        <Button size='sm' borderRadius='lg'>
          <IoIosAddCircleOutline />
          <Text>Create a project</Text>
        </Button>
      </Flex>
      <Box height='max-content' marginTop='8'>
        <ProjectList projectsData={projects} />
      </Box>
    </Box>
  );
}
