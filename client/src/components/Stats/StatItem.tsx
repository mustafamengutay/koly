import {
  Box,
  HStack,
  StatHelpText,
  StatLabel,
  StatRoot,
  StatValueText,
} from '@chakra-ui/react';

interface StatProps {
  label: string;
  value: string | number;
}

export default function StatItem({ label, value }: StatProps) {
  return (
    <Box borderWidth='thin' borderRadius='lg' padding='4' flexBasis='full'>
      <StatRoot>
        <StatLabel>{label}</StatLabel>
        <HStack>
          <StatValueText>{value}</StatValueText>
        </HStack>
        <StatHelpText>since last month</StatHelpText>
      </StatRoot>
    </Box>
  );
}
