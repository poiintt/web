"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@prisma/eclipse";

const tags = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
  "Prisma",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
];

export function MultiSelectComboboxExample() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const anchor = useComboboxAnchor();

  return (
    <div className="space-y-4">
      <Combobox
        multiple
        value={selectedTags}
        onValueChange={(value) => setSelectedTags(value as string[])}
      >
        <ComboboxChips ref={anchor}>
          {selectedTags.map((tag) => (
            <ComboboxChip key={tag}>{tag}</ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder="Add tags..." />
        </ComboboxChips>
        <ComboboxContent anchor={anchor.current}>
          <ComboboxList>
            {tags.map((tag) => (
              <ComboboxItem key={tag} value={tag}>
                {tag}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No tags found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      <div className="text-sm text-foreground-neutral-weak">
        Selected: {selectedTags.length > 0 ? selectedTags.join(", ") : "None"}
      </div>
    </div>
  );
}

const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

export function ControlledComboboxExample() {
  const [value, setValue] = useState<string>("");

  return (
    <div className="space-y-4">
      <Combobox value={value} onValueChange={(val) => setValue(val || "")}>
        <ComboboxInput placeholder="Select an option..." />
        <ComboboxContent>
          <ComboboxList>
            {options.map((option) => (
              <ComboboxItem key={option} value={option}>
                {option}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      <p className="text-sm text-foreground-neutral-weak">
        Selected: {value || "None"}
      </p>
    </div>
  );
}

const users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
  { id: "4", name: "Alice Williams", email: "alice@example.com" },
  { id: "5", name: "Charlie Brown", email: "charlie@example.com" },
];

export function CustomFilterComboboxExample() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const filteredUsers = users.filter((user) => {
    const search = searchValue.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="space-y-4">
      <Combobox
        value={selectedUser}
        onValueChange={(val) => setSelectedUser(val || "")}
      >
        <ComboboxInput
          placeholder="Search users..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <ComboboxContent>
          <ComboboxList>
            {filteredUsers.map((user) => (
              <ComboboxItem key={user.id} value={user.id}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-foreground-neutral-weak">
                    {user.email}
                  </span>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No users found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      <div className="text-sm text-foreground-neutral-weak">
        {selectedUserData ? (
          <div>
            <p>Selected User: {selectedUserData.name}</p>
            <p className="text-xs">{selectedUserData.email}</p>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </div>
    </div>
  );
}
