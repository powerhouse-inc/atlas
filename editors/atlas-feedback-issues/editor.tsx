import { WagmiContext } from "@powerhousedao/design-system";
import { ViewNode, ViewNodeMap } from "@powerhousedao/mips-parser";
import { EditorProps, utils } from "document-model/document";
import {
  AtlasFeedbackIssuesLocalState,
  actions,
  CreateIssueInput,
  DeleteIssueInput,
  CreateCommentInput,
  DeleteCommentInput,
  EditCommentInput,
  AddNotionIdInput,
  RemoveNotionIdInput,
} from "../../document-models/atlas-feedback-issues";
import { AtlasFeedbackIssuesAction } from "../../document-models/atlas-feedback-issues";
import { AtlasFeedbackIssuesState } from "../../document-models/atlas-feedback-issues";
import { ADDRESS_ALLOW_LIST } from "../../document-models/atlas-feedback-issues/src/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dispatchCreateIssueEvent } from "./utils";
import {
  AddNotionIdToIssueEvent,
  CreateIssueEvent,
  eventNames,
  RemoveNotionIdFromIssueEvent,
  SelectCommentEvent,
  SelectIssueEvent,
  SelectNotionIdEvent,
} from "./utils/events";
import { Login } from "./components/login";
import { Issues } from "./components/issues";
import { CreateCommentForm } from "./components/create-comment-form";
import { Comments } from "./components/comments";
import { baseUrl } from "./constants";

type SelectedItemsState = {
  selectedIssuePhid: string | null;
  selectedNotionId: string | null;
  selectedCommentPhid: string | null;
  setSelectedIssuePhid: (phid: string | null) => void;
  setSelectedNotionId: (notionId: string | null) => void;
  setSelectedCommentPhid: (phid: string | null) => void;
};
export type AtlasFeedbackIssuesEditorCustomProps = {
  scopes?: ViewNode[];
  selectedItemsState?: SelectedItemsState;
};
export type AtlasFeedbackIssuesEditorProps = EditorProps<
  AtlasFeedbackIssuesState,
  AtlasFeedbackIssuesAction,
  AtlasFeedbackIssuesLocalState
> &
  AtlasFeedbackIssuesEditorCustomProps;

export function AtlasFeedbackIssuesEditor(
  props: AtlasFeedbackIssuesEditorProps,
) {
  const {
    scopes = null,
    document,
    context,
    dispatch,
    selectedItemsState,
  } = props;
  const [selectedIssuePhidInternal, setSelectedIssuePhidInternal] = useState<
    string | null
  >(null);
  const [selectedNotionIdInternal, setSelectedNotionIdInternal] = useState<
    string | null
  >(null);
  const [selectedCommentPhidInternal, setSelectedCommentPhidInternal] =
    useState<string | null>(null);
  const selectedItemsStateInternal = {
    selectedIssuePhid: selectedIssuePhidInternal,
    selectedNotionId: selectedNotionIdInternal,
    selectedCommentPhid: selectedCommentPhidInternal,
    setSelectedIssuePhid: setSelectedIssuePhidInternal,
    setSelectedNotionId: setSelectedNotionIdInternal,
    setSelectedCommentPhid: setSelectedCommentPhidInternal,
  };

  const {
    selectedIssuePhid,
    selectedNotionId,
    selectedCommentPhid,
    setSelectedIssuePhid,
    setSelectedNotionId,
    setSelectedCommentPhid,
  } = selectedItemsState ?? selectedItemsStateInternal;

  const { user } = context;
  const scopesRef = useRef<ViewNode[] | null>(scopes ?? null);
  useEffect(() => {
    if (scopes || !baseUrl) return;

    async function fetchScopes() {
      const url = new URL("/api/view-node-tree", baseUrl);
      const response = await fetch(url);
      const viewNodeMap = (await response.json()) as ViewNodeMap;
      const nodes = Object.values(viewNodeMap) as ViewNode[];
      const scopes = nodes.filter((node) => node.type === "scope");
      scopesRef.current = scopes;
    }
    fetchScopes().catch(console.error);
  }, [scopes]);

  const state = document.state.global;
  const issues = document.state.global.issues;
  const allComments = useMemo(() => {
    return issues.flatMap((i) => i.comments);
  }, [issues]);
  const selectedIssue =
    issues.find((i) => i.phid === selectedIssuePhid) ?? null;
  const selectedComment =
    allComments.find((c) => c.phid === selectedCommentPhid) ?? null;

  const handleCreateIssue = useCallback(
    (event: CreateIssueEvent) => {
      const { notionIds } = event.detail;
      const phid = utils.hashKey();
      const input: CreateIssueInput = {
        phid,
        notionIds,
        createdAt: new Date().toISOString(),
      };
      dispatch(actions.createIssue(input));
      setSelectedIssuePhid(phid);
      setSelectedNotionId(notionIds[0] ?? null);
      setSelectedCommentPhid(null);
    },
    [
      dispatch,
      setSelectedIssuePhid,
      setSelectedNotionId,
      setSelectedCommentPhid,
    ],
  );

  const handleDeleteIssue = useCallback(
    (input: DeleteIssueInput) => {
      dispatch(actions.deleteIssue(input));
      if (input.phid === selectedIssuePhid) {
        setSelectedIssuePhid(null);
        setSelectedNotionId(null);
        setSelectedCommentPhid(null);
      }
    },
    [
      dispatch,
      setSelectedIssuePhid,
      selectedIssuePhid,
      setSelectedNotionId,
      setSelectedCommentPhid,
    ],
  );

  const handleAddNotionId = useCallback(
    (event: AddNotionIdToIssueEvent) => {
      const { notionId, phid } = event.detail;
      const input: AddNotionIdInput = {
        phid,
        notionId,
      };
      dispatch(actions.addNotionId(input));
      setSelectedIssuePhid(phid);
      setSelectedNotionId(notionId);
      setSelectedCommentPhid(null);
    },
    [
      dispatch,
      setSelectedNotionId,
      setSelectedIssuePhid,
      setSelectedCommentPhid,
    ],
  );

  const handleRemoveNotionId = useCallback(
    (event: RemoveNotionIdFromIssueEvent) => {
      const { notionId, phid } = event.detail;
      const input: RemoveNotionIdInput = {
        phid,
        notionId,
      };
      dispatch(actions.removeNotionId(input));
      if (selectedNotionId === notionId) {
        setSelectedNotionId(null);
      }
      if (selectedComment?.notionId === notionId) {
        setSelectedCommentPhid(null);
      }
    },
    [
      dispatch,
      selectedNotionId,
      selectedComment?.notionId,
      setSelectedNotionId,
      setSelectedCommentPhid,
    ],
  );

  const handleCreateComment = useCallback(
    (input: CreateCommentInput) => {
      dispatch(actions.createComment(input));
      setSelectedIssuePhid(input.issuePhid);
      setSelectedNotionId(input.notionId);
      setSelectedCommentPhid(input.phid);
    },
    [
      dispatch,
      setSelectedCommentPhid,
      setSelectedIssuePhid,
      setSelectedNotionId,
    ],
  );

  const handleDeleteComment = useCallback(
    (input: DeleteCommentInput) => {
      dispatch(actions.deleteComment(input));
      if (input.phid === selectedCommentPhid) {
        setSelectedCommentPhid(null);
      }
    },
    [dispatch, selectedCommentPhid, setSelectedCommentPhid],
  );

  const handleEditComment = useCallback(
    (input: EditCommentInput) => {
      dispatch(
        actions.editComment({
          ...input,
          editedAt: new Date().toISOString(),
        }),
      );
    },
    [dispatch],
  );

  const handleSelectIssue = useCallback(
    (event: SelectIssueEvent) => {
      const { phid } = event.detail;
      setSelectedIssuePhid(phid === selectedIssuePhid ? null : phid);
      setSelectedNotionId(null);
      setSelectedCommentPhid(null);
    },
    [
      setSelectedIssuePhid,
      selectedIssuePhid,
      setSelectedNotionId,
      setSelectedCommentPhid,
    ],
  );

  const handleSelectNotionId = useCallback(
    (event: SelectNotionIdEvent) => {
      const { issuePhid, notionId } = event.detail;
      setSelectedIssuePhid(issuePhid);
      setSelectedNotionId(notionId);
      setSelectedCommentPhid(null);
    },
    [setSelectedIssuePhid, setSelectedNotionId, setSelectedCommentPhid],
  );

  const handleSelectComment = useCallback(
    (event: SelectCommentEvent) => {
      const { issuePhid, notionId, phid } = event.detail;
      setSelectedIssuePhid(issuePhid);
      setSelectedNotionId(notionId);
      setSelectedCommentPhid(phid);
    },
    [setSelectedIssuePhid, setSelectedNotionId, setSelectedCommentPhid],
  );

  useEffect(() => {
    window.addEventListener(eventNames.CREATE_ISSUE, handleCreateIssue);
    window.addEventListener(
      eventNames.ADD_NOTION_ID_TO_ISSUE,
      handleAddNotionId,
    );
    window.addEventListener(
      eventNames.REMOVE_NOTION_ID_FROM_ISSUE,
      handleRemoveNotionId,
    );
    window.addEventListener(eventNames.SELECT_ISSUE, handleSelectIssue);
    window.addEventListener(eventNames.SELECT_NOTION_ID, handleSelectNotionId);
    window.addEventListener(eventNames.SELECT_COMMENT, handleSelectComment);

    return () => {
      window.removeEventListener(eventNames.CREATE_ISSUE, handleCreateIssue);
      window.removeEventListener(
        eventNames.ADD_NOTION_ID_TO_ISSUE,
        handleAddNotionId,
      );
      window.removeEventListener(
        eventNames.REMOVE_NOTION_ID_FROM_ISSUE,
        handleRemoveNotionId,
      );
      window.removeEventListener(eventNames.SELECT_ISSUE, handleSelectIssue);
      window.removeEventListener(
        eventNames.SELECT_NOTION_ID,
        handleSelectNotionId,
      );
      window.removeEventListener(
        eventNames.SELECT_COMMENT,
        handleSelectComment,
      );
    };
  }, [
    handleCreateIssue,
    handleAddNotionId,
    handleRemoveNotionId,
    handleSelectIssue,
    handleSelectNotionId,
    handleSelectComment,
  ]);

  const showIssues = !!user && ADDRESS_ALLOW_LIST.includes(user.address);

  const replyIcon = (
    <svg
      className="justify-self-end"
      height={16}
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.98956 5.27202C7.73443 5.27202 6.2301 5.25335 5.98956 5.27202C2.02729 5.57668 1.32289 8.60535 1.32289 11.9387V12.6053C2.56743 11.3287 3.32289 10.6053 5.98956 10.6053C6.48663 10.6053 7.38596 10.6053 7.98956 10.6053L8.00976 12.3213C8.00976 13.268 8.59423 13.556 9.31516 12.9647L14.1023 9.03601C14.8409 8.43001 14.8409 7.44735 14.1023 6.84135L9.31516 2.91268C8.59423 2.32135 8.00976 2.60935 8.00976 3.55601L7.98956 5.27202Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.002"
      />
    </svg>
  );

  return (
    <WagmiContext>
      {showIssues ? (
        <section className="h-full p-2">
          <h2 className="flex items-center relative mb-3">
            <span className="w-full text-center text-gray-900 text-lg font-semibold">
              Coordination Group
            </span>
            <div className="absolute right-0">{replyIcon}</div>
          </h2>
          <Issues
            handleDeleteIssue={handleDeleteIssue}
            issues={issues}
            scopes={scopesRef.current ?? []}
            selectedIssuePhid={selectedIssuePhid}
            selectedNotionId={selectedNotionId}
            state={state}
          />
          {!!selectedIssue && !!selectedNotionId && (
            <>
              <div className="h-px bg-gray-300 mt-3.5 mb-5" />
              <div className="bg-gray-100 p-2 rounded-xl">
                <Comments
                  handleDeleteComment={handleDeleteComment}
                  handleEditComment={handleEditComment}
                  issue={selectedIssue}
                  notionId={selectedNotionId}
                  state={state}
                  user={user}
                />
                <CreateCommentForm
                  handleCreateComment={handleCreateComment}
                  issue={selectedIssue}
                  key="new-comment"
                  notionId={selectedNotionId}
                  state={state}
                />
              </div>
            </>
          )}
          <div className="px-5">
            <button
              className="mt-2 bg-gray-900 text-gray-50 w-full flex justify-center items-center py-2 px-4 rounded-md"
              onClick={() => dispatchCreateIssueEvent([])}
            >
              Create new issue
            </button>
          </div>
        </section>
      ) : (
        <Login />
      )}
    </WagmiContext>
  );
}
