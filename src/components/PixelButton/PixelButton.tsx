import type { ButtonHTMLAttributes } from "react";
import styles from "./PixelButton.module.scss";

type PixelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function PixelButton({
  variant = "primary",
  className,
  ...props
}: PixelButtonProps) {
  const classes = [
    styles.button,
    variant === "secondary" ? styles.secondary : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}
