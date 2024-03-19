import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@radix-ui/themes";

import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Profile({
  enableEmail = true,
  bgTransparent = false,
}: any) {
  const { user } = useAuthStore((s) => s);
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "cursor-pointer flex items-center justify-center gap-x-4 rounded-md w-fit h-fit hover:shadow-md",
            bgTransparent ? "bg-transparent" : "bg-gray-50",
            enableEmail ? "p-2" : "",
            open ? "shadow-md" : "",
            enableEmail ? "" : "rounded-full"
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            className="relative w-10 h-10 rounded-full focus-visible:ring-transparent bg-transparent"
          >
            <Avatar className="h-10 w-10 b rounded-sm">
              <AvatarImage
                src="/profile-avatar.svg"
                alt="dummhy profile avatar"
              />
              <AvatarFallback className="bg-primary-foreground text-black text-lg">
                {user?.email?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
          {enableEmail ? (
            <>
              <div className="hidden md:flex flex-col ml-auto">
                <Text className="whitespace-nowrap font-normal ">
                  {user?.email}
                </Text>
              </div>
              <div className="w-5 h-5 flex flex-col items-center justify-center">
                <ChevronUpIcon className="w-4 h-auto" />
                <ChevronDownIcon className="w-4 h-auto" />
              </div>
            </>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Billing (Coming soon)</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/logout">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
