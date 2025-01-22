import type { RawViewNode, ViewNode } from "@powerhousedao/mips-parser";
import { useCallback, useState } from "react";
import { NodeOptionsCombobox } from "./node-options-combobox";
import { AtlasFeedbackIssue } from "document-models/atlas-feedback-issues";
import { cn, makeViewNodeTitleText } from "../utils";
import { Chevron } from "./chevron";
import { dispatchSelectNotionIdEvent } from "../utils/events";

type Props = {
  viewNode: ViewNode;
  issue: AtlasFeedbackIssue | null;
  issues: AtlasFeedbackIssue[];
  level?: number;
  tempIsDisplay?: boolean;
  selectedNotionId: string | null;
};

export function Node(props: Props) {
  const {
    viewNode,
    issue,
    tempIsDisplay = false,
    level = 0,
    selectedNotionId,
  } = props;
  const [open, setOpen] = useState(
    !!selectedNotionId &&
      (selectedNotionId === viewNode.slugSuffix ||
        viewNode.descendantSlugSuffixes.includes(selectedNotionId)),
  );
  const hasSubDocuments = viewNode.subDocuments.length > 0;
  const isCategory = viewNode.type === "category";
  const title = isCategory
    ? viewNode.title.title
    : makeViewNodeTitleText(viewNode as RawViewNode);

  const onNodeTitleClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      setOpen((prev) => !prev);
      if (tempIsDisplay) return;
      dispatchSelectNotionIdEvent({
        issuePhid: issue?.phid ?? "",
        notionId: viewNode.slugSuffix,
      });
    },
    [tempIsDisplay, viewNode, issue],
  );

  const fileIcon = (
    <svg
      className="flex-none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M3.73281 2.13307C3.43826 2.13307 3.19948 2.37186 3.19948 2.66641V13.3331C3.19948 13.6276 3.43826 13.8664 3.73281 13.8664H12.2661C12.5607 13.8664 12.7995 13.6276 12.7995 13.3331V6.39974H9.06615C8.77159 6.39974 8.53281 6.16096 8.53281 5.86641V2.13307H3.73281ZM9.59948 2.88732L12.0452 5.33307H9.59948V2.88732ZM2.13281 2.66641C2.13281 1.78275 2.84916 1.06641 3.73281 1.06641H9.06615C9.20759 1.06641 9.34325 1.1226 9.44327 1.22262L13.7099 5.48928C13.81 5.5893 13.8661 5.72496 13.8661 5.86641V13.3331C13.8661 14.2167 13.1498 14.9331 12.2661 14.9331H3.73281C2.84916 14.9331 2.13281 14.2167 2.13281 13.3331V2.66641Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="mb-3" style={{ marginLeft: `${(level ?? 0) * 8}px` }}>
      <li
        className="flex gap-2 items-start group cursor-pointer"
        onClick={onNodeTitleClick}
      >
        <div className="flex items-center gap-2 h-6">
          <Chevron
            className={hasSubDocuments ? "visible" : "invisible"}
            open={open}
          />
          {fileIcon}
        </div>
        <span
          className={cn(
            "font-normal text-sm text-gray-700",
            selectedNotionId === viewNode.slugSuffix ? "font-medium" : "",
          )}
        >
          {title}
        </span>
        <div className="flex items-center h-6">
          <NodeOptionsCombobox {...props} />
        </div>
      </li>
      {open ? (
        <>
          {tempIsDisplay ? (
            <p>
              {viewNode.content
                .map((c) => c.text.map((t) => t.text).join(""))
                .join("")}
            </p>
          ) : null}
          {viewNode.subDocuments.map((subDocument) => (
            <Node
              {...props}
              key={subDocument.slugSuffix}
              level={level + 1}
              viewNode={subDocument}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
