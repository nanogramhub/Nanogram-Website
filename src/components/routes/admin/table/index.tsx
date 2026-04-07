import { TableHeaders } from "./table-headers";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { AppwriteDocument } from "@/types/schema";

export function AdminTable<T extends AppwriteDocument, K extends keyof T>({
  items,
  format,
}: {
  items: T[];
  format: Record<
    K extends string ? K : never,
    "string" | "datetime" | "image"
  >[];
}) {
  if (items.length === 0) return null;
  const headers = format.map((item) => Object.keys(item));
  return (
    <Table>
      <TableHeaders headers={["Sl. No", ...headers]} />
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={item.$id}>
            <TableCell>{index + 1}</TableCell>
            {format.map((key) => (
              <TableCell key={key}>{String(item[key])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
