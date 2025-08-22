import React from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { X } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  onClick: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: SidebarItem[];
  title: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  items,
  title,
}) => {
  const handleItemClick = (item: SidebarItem) => {
    item.onClick();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {title}
            <Button size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;