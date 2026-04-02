import { Search } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const SearchInput = ({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) => {
  const [search, setSearch] = useState("");

  return (
    <InputGroup className="max-w-xs">
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
