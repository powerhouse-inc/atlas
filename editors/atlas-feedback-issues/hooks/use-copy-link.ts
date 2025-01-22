import { useCopyToClipboard } from "usehooks-ts";
import { useCallback } from "react";
import { baseUrl } from "../constants";

export function useCopyLink(args: {
  issueId?: string | null;
  notionId?: string | null;
  commentId?: string | null;
}) {
  const { issueId, notionId, commentId } = args;
  const [, copy] = useCopyToClipboard();

  const handleCopy = useCallback(
    (text: string) => {
      copy(text).catch((error: unknown) => {
        console.error("Failed to copy!", error);
      });
    },
    [copy],
  );

  const copyLink = useCallback(() => {
    const url = new URL(baseUrl);
    const existingSearchParams = new URLSearchParams(window.location.search);
    if (issueId) {
      existingSearchParams.set("issueId", issueId);
    }
    if (notionId) {
      existingSearchParams.set("notionId", notionId);
    }
    if (commentId) {
      existingSearchParams.set("commentId", commentId);
    }
    url.search = existingSearchParams.toString();
    handleCopy(url.toString());
  }, [issueId, notionId, commentId, handleCopy]);

  return copyLink;
}
