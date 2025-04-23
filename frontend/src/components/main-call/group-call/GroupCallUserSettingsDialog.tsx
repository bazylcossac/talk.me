import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { JSX } from "react";

function UserDropMenu({
  dropMenuVisible,
  setDropMenuVisible,
}: // trigger,
{
  dropMenuVisible: boolean;
  setDropMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  // trigger: JSX.Element;
}) {
  return (
    <DropdownMenu open={dropMenuVisible} onOpenChange={setDropMenuVisible}>
      <DropdownMenuContent>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropMenu;
