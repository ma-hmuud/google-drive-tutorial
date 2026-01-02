"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useState, type ChangeEvent } from "react";

export default function SearchInput() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const nextValue = debouncedSearch;
    const params = new URLSearchParams(window.location.search);
    const currentValue = params.get("search") ?? "";

    if (!nextValue && !currentValue) {
      return;
    }

    if (nextValue === currentValue) {
      return;
    }

    if (nextValue) {
      params.set("search", nextValue);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    const nextUrl = query ? `?${query}` : window.location.pathname;

    router.push(nextUrl);
  }, [debouncedSearch, router]);

  return (
    <Input
      type="search"
      placeholder="Search in Drive"
      className="bg-secondary w-full pl-10"
      onChange={onSearch}
      value={search}
    />
  );
}

function useDebounce(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
