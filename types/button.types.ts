import { MouseEvent, ReactNode } from "react";

export type TButton = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

};
