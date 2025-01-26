import { Table } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { Issue } from '../../types/issue.types';

interface IssuesTableProps {
  issuesData: Issue[];
}

export default function IssuesTable({ issuesData }: IssuesTableProps) {
  const navigate = useNavigate();

  const handleTableRowClick = (id: number) => {
    navigate(`${location.pathname}/issues/${id}`);
  };

  return (
    <Table.ScrollArea borderWidth='thin' rounded='lg' height='fit-content'>
      <Table.Root size='md' stickyHeader>
        <Table.Header>
          <Table.Row bg='bg.subtle'>
            <Table.ColumnHeader>Id</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Reporter</Table.ColumnHeader>
            <Table.ColumnHeader>Adopter</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Created at</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issuesData.map((issue) => (
            <Table.Row
              key={issue.id}
              onClick={() => handleTableRowClick(issue.id)}
              cursor='button'
            >
              <Table.Cell>{issue.id}</Table.Cell>
              <Table.Cell>{issue.type}</Table.Cell>
              <Table.Cell>{issue.title}</Table.Cell>
              <Table.Cell>{issue.description}</Table.Cell>
              <Table.Cell>{issue.status}</Table.Cell>
              <Table.Cell>
                {issue.reportedBy.name} {issue.reportedBy.surname}
              </Table.Cell>
              <Table.Cell>
                {issue.adoptedBy.name} {issue.adoptedBy.surname}
              </Table.Cell>
              <Table.Cell textAlign='end'>{issue.createdAt}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
