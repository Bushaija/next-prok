import {
  Cloud,
  Container,
  Plus,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const menuItems = [
  {
    label: "Identification",
    icon: Plus,
    url: "/identification",
  },
  {
    label: "Planning",
    icon: Plus,
    url: "/planning",
  },
  {
    label: "Publication of proc. plans",
    icon: Plus,
    url: "/publication",
  },
  {
    label: "Publication of tender",
    icon: Plus,
    url: "/publication-tender",
  },
  {
    label: "Opening of bids",
    icon: Plus,
    url: "#/open-bids",
  },
  {
    label: "Bid evaluation",
    icon: Plus,
    url: "#/bid-evaluation",
  },
  {
    label: "Contract signing",
    icon: Plus,
    url: "#/contract-signing",
  },
  {
    label: "Contract management",
    icon: Plus,
    url: "#/contract-signing",
  },
  {
    label: "Invoice",
    icon: Plus,
    url: "#/invoice",
  }
]

export const Menu: React.FC = () => {
  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Choose a procurement portal</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Procurement Portal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
            menuItems.map((item) => (
              <DropdownMenuItem key={item.label}>
                <item.icon />
                <Link href={`/new/${item.url}`}>{item.label}</Link>
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuGroup>


        <DropdownMenuItem disabled>
          <Cloud />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

      </DropdownMenuContent>
    </DropdownMenu> 
    <Link href="/new/identification" className="mt-4 text-sm underline">Start a new procurement process</Link>
    </>
  );
};
