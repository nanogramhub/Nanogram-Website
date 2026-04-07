import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { camelCaseToTitleCase } from "@/lib/utils";

export const TableHeaders = ({ headers }: { headers: string[] }) => {
  return (
    <TableHeader>
      <TableRow>
        {headers.map((header) => (
          <TableHead key={header}>{camelCaseToTitleCase(header)}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
