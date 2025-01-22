/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { AtlasFeedbackIssuesCommentsOperations } from "../../gen/comments/operations";
import {
  AtlasFeedbackCommentSchema,
  DeleteCommentInputSchema,
  EditCommentInputSchema,
} from "../../gen/schema/zod";
import { ADDRESS_ALLOW_LIST } from "../constants";
import {
  makeNewCommentValidator,
  makeExistingCommentValidator,
} from "../utils";

export const reducer: AtlasFeedbackIssuesCommentsOperations = {
  createCommentOperation(state, action, dispatch) {
    const creatorAddress = action.context?.signer?.user.address;
    if (!creatorAddress) {
      throw new Error("User is not signed in");
    }
    if (!ADDRESS_ALLOW_LIST.includes(creatorAddress)) {
      throw new Error("User is not allowed to submit comments");
    }
    const validator = AtlasFeedbackCommentSchema().merge(
      makeNewCommentValidator(state),
    );
    const input = {
      ...action.input,
      lastEditedAt: action.input.createdAt,
      creatorAddress,
    };
    const result = validator.safeParse(input);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const issue = state.issues.find(
      (issue) => issue.phid === action.input.issuePhid,
    );
    if (!issue) {
      throw new Error("Issue with this phid does not exist");
    }
    issue.comments.push(result.data);
    state.issues = state.issues.map((issue) =>
      issue.phid === action.input.issuePhid ? issue : issue,
    );
  },
  deleteCommentOperation(state, action, dispatch) {
    const creatorAddress = action.context?.signer?.user.address;
    if (!creatorAddress) {
      throw new Error("User is not signed in");
    }
    if (!ADDRESS_ALLOW_LIST.includes(creatorAddress)) {
      throw new Error("User is not allowed to delete comments");
    }
    const validator = DeleteCommentInputSchema().merge(
      makeExistingCommentValidator(state).omit({
        content: true,
      }),
    );
    const result = validator.safeParse(action.input);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const issue = state.issues.find(
      (issue) => issue.phid === action.input.issuePhid,
    );
    if (!issue) {
      throw new Error("Issue not found");
    }
    const comment = issue.comments.find((c) => c.phid === action.input.phid);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.creatorAddress !== creatorAddress) {
      throw new Error("User is not allowed to delete this comment");
    }
    issue.comments = issue.comments.filter((c) => c.phid !== comment.phid);
    state.issues = state.issues.map((i) => (i.phid === issue.phid ? issue : i));
  },
  editCommentOperation(state, action, dispatch) {
    const creatorAddress = action.context?.signer?.user.address;
    if (!creatorAddress) {
      throw new Error("User is not signed in");
    }
    if (!ADDRESS_ALLOW_LIST.includes(creatorAddress)) {
      throw new Error("User is not allowed to edit comments");
    }
    const validator = EditCommentInputSchema().merge(
      makeExistingCommentValidator(state),
    );
    const result = validator.safeParse(action.input);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const issue = state.issues.find(
      (issue) => issue.phid === action.input.issuePhid,
    );
    if (!issue) {
      throw new Error("Comment with this phid does not exist");
    }
    const comment = issue.comments.find(
      (comment) => comment.phid === action.input.phid,
    );
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.creatorAddress !== creatorAddress) {
      throw new Error("User is not allowed to edit this comment");
    }
    comment.content = result.data.content ?? comment.content;
    comment.notionId = result.data.notionId ?? comment.notionId;
    comment.lastEditedAt = action.input.editedAt;
    issue.comments = issue.comments.map((c) =>
      c.phid === action.input.phid ? comment : c,
    );
    state.issues = state.issues.map((issue) =>
      issue.phid === action.input.issuePhid ? issue : issue,
    );
  },
};
