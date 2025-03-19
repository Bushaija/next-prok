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
    url: "/publicationTender",
  },
  {
    label: "Opening of bids",
    icon: Plus,
    url: "/openBid",
  },
  {
    label: "Bid evaluation",
    icon: Plus,
    url: "/bidEvaluation",
  },
  {
    label: "Contract signing",
    icon: Plus,
    url: "/contractSigning",
  },
  {
    label: "Contract management",
    icon: Plus,
    url: "/contractManagement",
  },
  {
    label: "Invoice",
    icon: Plus,
    url: "/invoice",
  }
]

export const Menu: React.FC = () => {
  return (
    <>
      {/* <DropdownMenu>
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
    </DropdownMenu>  */}
    <Button variant="outline" className="p-3 px-4">
      <Link href="/list" >Start a new procurement process</Link>
    </Button>
    </>
  );
};
