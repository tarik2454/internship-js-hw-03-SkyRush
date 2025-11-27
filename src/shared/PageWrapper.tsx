import type { ReactNode } from "react";
import styles from "./PageWrapper.module.scss";

export default function PageWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.pageWrapper} ${className}`}>{children}</div>;
}
