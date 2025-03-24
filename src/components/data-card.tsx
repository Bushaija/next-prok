import { LucideIcon } from "lucide-react";
import { VariantProps, cva } from "class-variance-authority";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconColorVariant = cva("", {
  variants: {
    variant: {
      default: "text-blue-500",
      success: "text-emerald-500",
      danger: "text-rose-500",
      warning: "text-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconColorVariants = VariantProps<typeof iconColorVariant>;

interface DataCardProps extends BoxVariants, IconColorVariants {
  icon: LucideIcon;
  description: string;
  title: string;
  onClick?: () => void;
  iconColor?: string;
}

export const DataCard = ({
  icon: Icon, 
  title, 
  variant, 
  description, 
  onClick,
  iconColor
}: DataCardProps) => {
  // Determine if the iconColor is a Tailwind class or a direct color value
  const isTailwindClass = iconColor && !iconColor.startsWith('#');
  const iconStyle = iconColor && !isTailwindClass ? { color: iconColor } : undefined;
  
  // Get the appropriate Tailwind class if applicable
  let colorClass = '';
  if (!iconColor) {
    colorClass = iconColorVariant({ variant });
  } else if (isTailwindClass) {
    colorClass = `text-${iconColor}`;
  }
  
  return (
    <Card 
      className="border-none drop-shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col gap-2"
      onClick={onClick}
    >
      <CardHeader className="flex flex-col gap-2 items-start justify-between">
        <div className={cn(boxVariant({ variant }))}>
          <Icon 
            className={cn("h-6 w-6", colorClass)} 
            style={iconStyle}
          />
        </div>
        <div>
          <CardTitle>
            <h1 className="text-xl text-blue-500">{title}</h1>
          </CardTitle>
        </div>
        
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-md text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <ArrowRight 
          className={cn("h-5 w-5", colorClass)} 
          style={iconStyle}
        />
      </CardFooter>
    </Card>
  );
};


