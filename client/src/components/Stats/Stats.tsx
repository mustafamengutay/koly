import { Box } from '@chakra-ui/react';
import StatItem from './StatItem';

interface StatsProps {
  stats: {
    numberOfProjects: number;
    inProgressIssues: number;
    completedIssues: number;
    reportedIssues: number;
  };
}

export default function Stats(data: StatsProps) {
  return (
    <Box
      display='flex'
      flexDirection={{ base: 'column', sm: 'row' }}
      gap='4'
      justifyContent='space-between'
    >
      <StatItem
        label='Number of Projects'
        value={data.stats.numberOfProjects}
      />
      <StatItem
        label='In Progress Issues'
        value={data.stats.inProgressIssues}
      />
      <StatItem label='Completed Issues' value={data.stats.completedIssues} />
      <StatItem label='Reported Issues' value={data.stats.reportedIssues} />
    </Box>
  );
}
