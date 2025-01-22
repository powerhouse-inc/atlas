import { ViewNode } from "@powerhousedao/mips-parser";
import {
  AtlasFeedbackIssue as TIssue,
  AtlasFeedbackIssuesState,
  DeleteIssueInput,
} from "document-models/atlas-feedback-issues";
import { useMemo } from "react";
import { Scopes } from "./scopes";
import { filterViewNodesRecursively } from "../utils";
import { Chevron } from "./chevron";
import { IssueOptionsDropdown } from "./issue-options-dropdown";
import { dispatchSelectIssueEvent } from "../utils/events";

type Props = {
  issue: TIssue;
  issueNumber: number;
  state: AtlasFeedbackIssuesState;
  scopes: ViewNode[];
  handleDeleteIssue: (input: DeleteIssueInput) => void;
  selectedIssuePhid: string | null;
  selectedNotionId: string | null;
};
export function Issue(props: Props) {
  const {
    issue,
    state,
    issueNumber,
    scopes,
    handleDeleteIssue,
    selectedIssuePhid,
    selectedNotionId,
  } = props;
  const open = selectedIssuePhid === issue.phid;
  const filteredScopes = useMemo(() => {
    return filterViewNodesRecursively(scopes, issue.notionIds);
  }, [scopes, issue.notionIds]);
  return (
    <li>
      <button
        className="flex items-center justify-between cursor-pointer text-gray-800 text-sm mb-3 group w-full"
        onClick={() => {
          dispatchSelectIssueEvent(issue.phid);
        }}
      >
        <div className="flex items-center gap-3">
          <Chevron className="ml-1" open={open} />
          <span className="font-medium">Issue #{issueNumber}</span>
        </div>
        <IssueOptionsDropdown
          handleDeleteIssue={handleDeleteIssue}
          issue={issue}
        />
      </button>
      {open ? (
        <div className="pl-2">
          <Scopes
            issue={issue}
            issues={state.issues}
            scopes={filteredScopes}
            selectedNotionId={selectedNotionId}
          />
        </div>
      ) : null}
    </li>
  );
}
