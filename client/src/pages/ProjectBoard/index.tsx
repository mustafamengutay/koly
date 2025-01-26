// import { useParams } from 'react-router';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { SegmentedControl } from '../../components/ui/segmented-control';
import { Button } from '../../components/ui/button';
import { IoIosAddCircleOutline } from 'react-icons/io';
import IssuesTable from '../../components/Issues/IssuesTable';

function ProjectBoard() {
  //   const { projectId } = useParams<string>();
  const issues = [
    {
      id: 1,
      type: 'bug',
      title: 'X mode does not work',
      description: 'This is an issue for the project',
      status: 'open',
      createdAt: '2024-12-10',
      reportedBy: {
        name: 'John',
        surname: 'Doe',
      },
      adoptedBy: {
        name: 'Mick',
        surname: 'Hary',
      },
    },
  ];

  return (
    <DashboardLayout>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: '4', sm: '0' }}
        justifyContent='space-between'
        alignItems={{ base: 'center', md: 'end' }}
      >
        <Box>
          <Text
            textAlign={{ base: 'center', md: 'left' }}
            fontSize='3xl'
            fontWeight='medium'
            letterSpacing='tighter'
          >
            koly
          </Text>
          <Text fontSize={{ base: 'xs', sm: 'sm' }} color='fg.muted'>
            Here is the project overview
          </Text>
        </Box>
      </Flex>
      <Box marginTop='8'>
        <Flex
          flexDirection={{ base: 'column-reverse', md: 'row' }}
          justifyContent='space-between'
          alignItems='center'
          // alignItems={{ base: 'center', sm: 'end' }}
          gap={{ base: '8' }}
          marginTop='8'
        >
          <Flex
            gap={{ base: '8' }}
            alignItems='center'
            flexDirection={{ base: 'column-reverse', md: 'row' }}
          >
            <SegmentedControl
              size='sm'
              defaultValue='All'
              items={['All', 'In progress', 'Completed']}
            />
            <Input placeholder='Search an issue' size='sm' borderRadius='lg' />
          </Flex>
          <Box>
            <Button size='sm' borderRadius='lg'>
              <IoIosAddCircleOutline />
              <Text>Report an issue</Text>
            </Button>
          </Box>
        </Flex>

        <Box marginTop='8' height='100dvh'>
          <IssuesTable issuesData={issues} />
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default ProjectBoard;
