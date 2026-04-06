import { Search } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const SearchInput = ({
  setSearchQuery,
  className,
}: {
  setSearchQuery: (query: string) => void;
  className?: string;
}) => {
  const [search, setSearch] = useState("");

  return (
    <InputGroup className={cn("max-w-xs", className)}>
      <InputGroupInput
        placeholder="Search..."
        value={search}
        autoComplete="off"
        onChange={(e) => {
          setSearch(e.target.value);
          setSearchQuery(e.target.value);
        }}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;
