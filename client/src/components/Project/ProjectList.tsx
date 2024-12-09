import { Box, Grid } from '@chakra-ui/react';
import ProjectItem, { ProjectItemProps } from './ProjectItem';
import { EmptyState } from '../ui/empty-state';

import { GoProjectRoadmap } from 'react-icons/go';

interface ProjectListProps {
  projectsData: ProjectItemProps[];
}

export default function ProjectList({ projectsData }: ProjectListProps) {
  const projects = projectsData.map((project) => {
    return (
      <ProjectItem
        id={project.id}
        name={project.name}
        description={project.description}
        percentageOfCompletion={project.percentageOfCompletion}
      />
    );
  });

  return (
    <Grid
      gridTemplateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(5, 1fr)',
      }}
      gridGap='4'
    >
      {projects.length ? (
        projects
      ) : (
        <Box justifySelf='center' gridColumnStart='1' gridColumnEnd='6'>
          <EmptyState
            icon={<GoProjectRoadmap />}
            title='You do not have any project'
            description='Create a new project to track and share its issue'
            gridColumnStart='1'
            gridColumnEnd='5'
          />
        </Box>
      )}
    </Grid>
  );
}
