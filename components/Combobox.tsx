"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import { debounce } from "@/lib/debounce";
import { SearchIcon } from "lucide-react";

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  user: string;
  userImage: string;
}

interface ItemsProp {
  items: Post[];
  placeholder: string;
}

export function CustomCombobox({ items, placeholder }: ItemsProp) {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [query, setQuery] = useState("");

  const router = useRouter();

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()),
        );

  const debouncedPush = useCallback(
    debounce((path: string) => {
      router.push(path);
    }, 200),
    [router],
  );

  useEffect(() => {
    if (query) {
      debouncedPush(`?query=${query.toLocaleLowerCase()}`);
    } else {
      debouncedPush(`/`);
    }
  }, [query]);

  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem);
    }
  }, [selectedItem]);

  return (
    <div className="relative mx-auto w-full max-w-full">
      <Combobox
        value={selectedItem}
        onChange={(value: string | null) => setSelectedItem(value || "")}
      >
        <div className="relative w-full">
          <SearchIcon
            className="absolute inset-y-0 left-0 m-3 h-6 w-6 text-icon"
            aria-hidden="true"
          />
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(item: string) => item}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-full bg-button p-5 pl-12 text-foreground outline-none transition-all"
          />
        </div>

        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-button shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {query && (
            <ComboboxOption
              value={query}
              className={({ focus }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 transition-all ${
                  focus ? "bg-icon text-white" : "text-white/80"
                }`
              }
            >
              {({ selected, focus }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {query}
                  </span>
                  {selected ? (
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        focus ? "text-white" : "text-primary-bg"
                      }`}
                    >
                      ✓
                    </span>
                  ) : null}
                </>
              )}
            </ComboboxOption>
          )}

          {filteredItems.map((item) => (
            <ComboboxOption
              as="div"
              key={item.title}
              value={item.title}
              className={({ focus }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 transition-all ${
                  focus ? "bg-icon text-white" : "text-white/80"
                }`
              }
            >
              {({ selected, focus }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {item.title}
                  </span>
                  {selected ? (
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        focus ? "text-white" : "text-primary-bg"
                      }`}
                    >
                      ✓
                    </span>
                  ) : null}
                </>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
