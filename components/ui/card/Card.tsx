import type {
  HTMLAttributes,
} from "react";

export type CardProps =
  HTMLAttributes<HTMLDivElement>;

function Card({
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        text-white
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`
        border-b
        border-slate-800
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`
        border-t
        border-slate-800
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
