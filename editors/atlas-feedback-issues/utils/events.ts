export const eventNames = {
  CREATE_ISSUE: "CREATE_ISSUE",
  ADD_NOTION_ID_TO_ISSUE: "ADD_NOTION_ID_TO_ISSUE",
  REMOVE_NOTION_ID_FROM_ISSUE: "REMOVE_NOTION_ID_FROM_ISSUE",
  SELECT_ISSUE: "SELECT_ISSUE",
  SELECT_NOTION_ID: "SELECT_NOTION_ID",
  SELECT_COMMENT: "SELECT_COMMENT",
} as const;

export type CreateIssueEvent = CustomEvent<{ notionIds: string[] }>;
export type AddNotionIdToIssueEvent = CustomEvent<{
  notionId: string;
  phid: string;
}>;
export type RemoveNotionIdFromIssueEvent = CustomEvent<{
  notionId: string;
  phid: string;
}>;

export type SelectIssueEvent = CustomEvent<{
  phid: string;
}>;

export type SelectNotionIdEvent = CustomEvent<{
  issuePhid: string;
  notionId: string;
}>;

export type SelectCommentEvent = CustomEvent<{
  phid: string;
  issuePhid: string;
  notionId: string;
}>;

export function dispatchCreateIssueEvent(notionIds: string[]) {
  const event: CreateIssueEvent = new CustomEvent(eventNames.CREATE_ISSUE, {
    detail: {
      notionIds,
    },
  });
  window.dispatchEvent(event);
}

export function dispatchAddNotionIdToIssueEvent(
  notionId: string,
  phid: string,
) {
  const event: AddNotionIdToIssueEvent = new CustomEvent(
    eventNames.ADD_NOTION_ID_TO_ISSUE,
    {
      detail: {
        notionId,
        phid,
      },
    },
  );
  window.dispatchEvent(event);
}

export function dispatchRemoveNotionIdFromIssueEvent(
  notionId: string,
  phid: string,
) {
  const event: RemoveNotionIdFromIssueEvent = new CustomEvent(
    eventNames.REMOVE_NOTION_ID_FROM_ISSUE,
    {
      detail: {
        notionId,
        phid,
      },
    },
  );
  window.dispatchEvent(event);
}

export function dispatchSelectIssueEvent(phid: string) {
  const event: SelectIssueEvent = new CustomEvent(eventNames.SELECT_ISSUE, {
    detail: {
      phid,
    },
  });
  window.dispatchEvent(event);
}

export function dispatchSelectNotionIdEvent({
  issuePhid,
  notionId,
}: {
  issuePhid: string;
  notionId: string;
}) {
  const event: SelectNotionIdEvent = new CustomEvent(
    eventNames.SELECT_NOTION_ID,
    {
      detail: {
        issuePhid,
        notionId,
      },
    },
  );
  window.dispatchEvent(event);
}

export function dispatchSelectCommentEvent({
  issuePhid,
  notionId,
  phid,
}: {
  issuePhid: string;
  notionId: string;
  phid: string;
}) {
  const event: SelectCommentEvent = new CustomEvent(eventNames.SELECT_COMMENT, {
    detail: {
      issuePhid,
      notionId,
      phid,
    },
  });
  window.dispatchEvent(event);
}
