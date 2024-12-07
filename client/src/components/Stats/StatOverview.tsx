import { Box, Flex, Text } from '@chakra-ui/react';
import { SegmentedControl } from '../ui/segmented-control';
import Stats from './Stats';

export default function StatOverview() {
  const stats = {
    numberOfProjects: 8,
    inProgressIssues: 12,
    completedIssues: 158,
    reportedIssues: 46,
  };

  return (
    <Box as='section'>
      <Flex
        flexDirection={{ base: 'column', sm: 'row' }}
        gap={{ base: '4', sm: '0' }}
        justifyContent='space-between'
        alignItems={{ base: 'center', sm: 'end' }}
      >
        <Box>
          <Text
            textAlign='center'
            fontSize={{ base: '2xl', sm: '3xl' }}
            fontWeight='medium'
            letterSpacing='tighter'
          >
            Hello, John!
          </Text>
          <Text fontSize={{ base: 'xs', sm: 'sm' }} color='fg.muted'>
            Here is your overview
          </Text>
        </Box>
        <SegmentedControl
          size='sm'
          defaultValue='All'
          items={['All', 'Last Month']}
        />
      </Flex>
      <Box marginTop='8'>
        <Stats stats={stats} />
      </Box>
    </Box>
  );
}
