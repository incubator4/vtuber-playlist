"use client";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useTheme } from "next-themes";

interface ThemeSwitcherProps {
  type?: "dropdown" | "tabs";
}

const ThemeSwitcher = ({ type = "dropdown" }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  // show the system text only width bigger than 640px
  if (type === "dropdown")
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Theme</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Change theme"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([theme as string])}
          onSelectionChange={(keys) => {
            const _theme = (keys as Set<string>).values().next().value;
            setTheme(_theme);
          }}
        >
          <DropdownItem key="light">Light</DropdownItem>
          <DropdownItem key="dark">Dark</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  else
    return (
      <Tabs
        size="sm"
        aria-label="Options"
        selectedKey={theme}
        onSelectionChange={(key) => {
          setTheme(key as string);
        }}
      >
        <Tab key="light" title="Light" />
        <Tab key="dark" title="Dark" />
        <Tab key="system" title="System" />
      </Tabs>
    );
};

export default ThemeSwitcher;
