import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline";

const variantClasses: Record<Variant, string> = {
  // Accent border, fills faintly on hover.
  primary: "border-accent hover:bg-accent-muted text-heading",
  // Neutral border, picks up the accent on hover.
  outline: "border-line hover:border-accent hover:bg-accent-muted text-body hover:text-heading",
};

const baseClasses =
  "inline-flex items-center gap-2 border px-4 py-2 text-base transition-colors";

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** External links open in a new tab and get rel=noreferrer. */
  external?: boolean;
};

/** Square-cornered bordered link. The template has no filled buttons. */
export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  external = false,
}: ButtonLinkProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
