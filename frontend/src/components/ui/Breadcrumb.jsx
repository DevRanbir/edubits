import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import "./Breadcrumb.css";

export function Breadcrumb({ children, className = "", ...props }) {
  return (
    <nav aria-label="breadcrumb" className={`radix-breadcrumb ${className}`} {...props}>
      {children}
    </nav>
  );
}

export function BreadcrumbList({ children, className = "", ...props }) {
  return (
    <ol className={`radix-breadcrumb-list ${className}`} {...props}>
      {children}
    </ol>
  );
}

export function BreadcrumbItem({ children, className = "", ...props }) {
  return (
    <li className={`radix-breadcrumb-item ${className}`} {...props}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({ children, to, href, className = "", ...props }) {
  if (to) {
    return (
      <Link to={to} className={`radix-breadcrumb-link ${className}`} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`radix-breadcrumb-link ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <span className={`radix-breadcrumb-link ${className}`} {...props}>
      {children}
    </span>
  );
}

export function BreadcrumbPage({ children, className = "", ...props }) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={`radix-breadcrumb-page ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({ children, className = "", ...props }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={`radix-breadcrumb-separator ${className}`}
      {...props}
    >
      {children ?? <ChevronRight size={14} strokeWidth={2} />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className = "", ...props }) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={`radix-breadcrumb-ellipsis ${className}`}
      {...props}
    >
      <MoreHorizontal size={14} />
      <span className="sr-only">More</span>
    </span>
  );
}
