import { z } from "zod";
import { AtlasFeedbackIssuesState } from "../gen";

export const dateValidator = z.coerce.date();

export const numberValidator = z.number();

export function makeUniqueStringValidator(
  stringsToCheck: string[],
  message?: string,
) {
  return z.string().refine((s) => !stringsToCheck.includes(s), {
    message: message ?? "Item already exists",
  });
}

export function makeStringExistsValidator(
  stringsToCheck: string[],
  message?: string,
) {
  return z.string().refine((s) => stringsToCheck.includes(s), {
    message: message ?? "Item does not exist exist",
  });
}

export function makeStringEqualsValidator(
  stringToCheck: string,
  message?: string,
) {
  return z.string().refine((s) => s === stringToCheck, {
    message: message ?? "String does not match",
  });
}

export function makeIssueValidator(state: AtlasFeedbackIssuesState) {
  return z.object({
    phid: makeUniqueStringValidator(
      state.issues.map((issue) => issue.phid),
      "Issue with this phid already exists",
    ),
  });
}

export function makeDeleteIssueValidator(state: AtlasFeedbackIssuesState) {
  return z.object({
    phid: makeStringExistsValidator(
      state.issues.map((issue) => issue.phid),
      "Issue with this phid does not exist",
    ),
  });
}

export function makeNewCommentValidator(state: AtlasFeedbackIssuesState) {
  return z.object({
    content: z.string().min(1, "Comment cannot be empty"),
    notionId: z.string().min(1, "Notion ID cannot be empty"),
    issuePhid: makeStringExistsValidator(
      state.issues.map((issue) => issue.phid),
      "Issue with this phid does not exist",
    ),
    phid: makeUniqueStringValidator(
      state.issues.flatMap((issue) => issue.comments.map((c) => c.phid)),
      "Comment with this phid already exists",
    ),
  });
}

export function makeExistingCommentValidator(state: AtlasFeedbackIssuesState) {
  return z.object({
    content: z.string().min(1, "Comment cannot be empty"),
    issuePhid: makeStringExistsValidator(
      state.issues.map((issue) => issue.phid),
      "Issue with this phid does not exist",
    ),
    phid: makeStringExistsValidator(
      state.issues.flatMap((issue) => issue.comments.map((c) => c.phid)),
      "Comment with this phid does not exist",
    ),
  });
}
