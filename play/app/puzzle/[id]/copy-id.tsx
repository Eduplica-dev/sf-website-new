"use client";

import { useState } from "react";

/** The doc's item C: a pressable copy button next to the Puzzle ID. */
export default function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(id)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {});
      }}
      style={{
        marginLeft: 8,
        padding: "4px 10px",
        border: "1px solid #B9AFDA",
        borderRadius: 8,
        background: "#FFFFFF",
        color: "#5C489D",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
