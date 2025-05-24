import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const backgroundVariant = cva("rounded-full flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-blue-100",
      success: "bg-emerald-100",
    },
    size: {
      default: "p-2",
      sm: "p-1",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-blue-700",
      success: "text-emerald-700",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BackgroundVariantProps = VariantProps<typeof backgroundVariant>;
type IconVariantProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
  icon: LucideIcon;
}

export const IconBadge: React.FC<IconBadgeProps> = ({ icon: Icon, variant, size }) => {
  return (
    <div className={backgroundVariant({ variant, size })}>
      <Icon className={iconVariants({ variant, size })} />
    </div>
  );
}