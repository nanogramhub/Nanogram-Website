import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminPagination = ({
  currentPage,
  prevPage,
  nextPage,
  totalPages,
  pageSize,
  setPageSize,
}: {
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  totalPages: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
}) => {
  return (
    <div className="flex items-center gap-4 w-fit mx-auto">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          defaultValue={String(pageSize)}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="w-15" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="32">32</SelectItem>
              <SelectItem value="64">64</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={prevPage}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            <span className="hidden sm:block">Previous</span>
          </Button>
          <PaginationItem>
            <PaginationLink>
              {currentPage} / {totalPages}
            </PaginationLink>
          </PaginationItem>
          <Button
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={nextPage}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AdminPagination;
