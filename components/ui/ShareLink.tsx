"use client";

import React from "react";

interface ShareLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  title?: string;
  text?: string;
  children: React.ReactNode;
}

export default function ShareLink({
  href,
  title = "",
  text = "",
  children,
  className,
  ...rest
}: ShareLinkProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent standard navigation
    e.preventDefault();

    // Resolve absolute URL if a relative path is passed
    const absoluteUrl = new URL(href, window.location.origin).toString();

    const shareData = {
      title,
      text,
      url: absoluteUrl,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error("Error opening share sheet:", error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(absoluteUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Clipboard copy failed:", error);
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      role="button"
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
