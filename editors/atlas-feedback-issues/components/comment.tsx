import { formatEthAddress } from "@powerhousedao/design-system";
import {
  EditCommentInput,
  DeleteCommentInput,
  AtlasFeedbackIssuesState,
  AtlasFeedbackIssue as TIssue,
  AtlasFeedbackComment as TComment,
} from "document-models/atlas-feedback-issues";
import { Fragment, useCallback, useState } from "react";
import { Address } from "viem";
import { useEnsName } from "wagmi";
import { EditCommentForm } from "./edit-comment-form";
import { formatDateForDisplay } from "../utils/date";
import { cn } from "../utils";
import { Avatar } from "./avatar";
import { CommentOptionsDropdown } from "./comment-options-dropdown";
import { User } from "document-model/document";
import { dispatchSelectCommentEvent } from "../utils/events";

type Props = {
  issue: TIssue;
  comment: TComment;
  user: User;
  state: AtlasFeedbackIssuesState;
  handleEditComment: (input: EditCommentInput) => void;
  handleDeleteComment: (input: DeleteCommentInput) => void;
};
export function Comment(props: Props) {
  const {
    issue,
    comment,
    user,
    state,
    handleEditComment,
    handleDeleteComment,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const ensNameResult = useEnsName({
    address: comment.creatorAddress as Address,
  });
  const ensName = ensNameResult.data ?? undefined;
  const formattedAddress = formatEthAddress(comment.creatorAddress);
  const userIsCreator = user.address === comment.creatorAddress;
  const displayName = ensName ?? (userIsCreator ? "You" : formattedAddress);

  const onSubmitEditComment = useCallback(
    (input: EditCommentInput) => {
      handleEditComment(input);
      setIsEditing(false);
    },
    [handleEditComment],
  );

  const onCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const containerClass = userIsCreator
    ? "bg-gray-300 text-gray-900 ml-4 text-right"
    : "bg-gray-900 text-gray-50 mr-4";

  const timestampClass = userIsCreator
    ? "text-right text-gray-600"
    : "text-right text-gray-400";

  const formattedComment = comment.content.split("\n").map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));

  return (
    <div
      className={cn(containerClass, "p-2 rounded-lg group")}
      onClick={() => {
        dispatchSelectCommentEvent({
          phid: comment.phid,
          notionId: comment.notionId,
          issuePhid: issue.phid,
        });
      }}
    >
      <div
        className={cn(
          "flex text-left items-center justify-between",
          userIsCreator ? "text-gray-600" : "text-gray-400",
        )}
      >
        <div className="flex items-center gap-1">
          <Avatar address={comment.creatorAddress as Address} />
          {userIsCreator ? "You" : displayName}
        </div>
        <CommentOptionsDropdown
          comment={comment}
          handleDeleteComment={handleDeleteComment}
          issue={issue}
          onEditComment={() => setIsEditing(true)}
          userIsCreator={userIsCreator}
        />
      </div>
      {isEditing ? (
        <div className="px-2">
          <EditCommentForm
            comment={comment}
            handleDeleteComment={handleDeleteComment}
            isEditing={isEditing}
            issue={issue}
            onCancel={onCancel}
            onSubmitEditComment={onSubmitEditComment}
            state={state}
          />
        </div>
      ) : (
        <div className="px-2">
          <p className="text-inherit pb-1.5">{formattedComment}</p>
        </div>
      )}
      <span className={cn(timestampClass, "block text-right mr-1 mt-1")}>
        {formatDateForDisplay(comment.lastEditedAt)}
      </span>
    </div>
  );
}
