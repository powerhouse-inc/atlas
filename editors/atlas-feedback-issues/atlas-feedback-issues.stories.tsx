import { Meta } from "@storybook/react";
import { AtlasFeedbackIssuesEditor as Editor } from "./editor";
import { createDocumentStory } from "document-model-libs/utils";
import {
  Issue,
  reducer,
  utils,
} from "../../document-models/atlas-feedback-issues";
import { ADDRESS_ALLOW_LIST } from "../../document-models/atlas-feedback-issues/src/constants";
import { ComponentProps } from "react";
import viewNodeTree from "./mocks/view-node-tree.json";
import { ViewNode } from "@powerhousedao/mips-parser";
import { Scopes } from "./components/scopes";
import { defaultMockUser } from "./mocks/mocks";

const mockScopes = Object.values(
  viewNodeTree as Record<string, ViewNode>,
).filter((node) => node.type === "scope");

const allNotionIds = Object.keys(viewNodeTree);

function getRandomNotionIds(allIds: string[], count = 5): string[] {
  const availableIds = [...allIds]; // Create a copy to avoid modifying original array
  const result: string[] = [];

  // Get minimum between requested count and available IDs
  const actualCount = Math.min(count, availableIds.length);

  for (let i = 0; i < actualCount; i++) {
    // Get random index from remaining available IDs
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    // Remove and add the ID to our result
    const [selectedId] = availableIds.splice(randomIndex, 1);
    result.push(selectedId);
  }

  return result;
}

const mockIssues: Issue[] = Array.from({ length: 5 }, (_, i) => {
  const notionIds = getRandomNotionIds(allNotionIds, 5);
  return {
    phid: `PHID-ISSUE-${i}`,
    notionIds,
    comments: Array.from({ length: 5 }, (_, j) => ({
      phid: `COMMENT-ID-${i}-${j}`,
      issuePhid: `PHID-ISSUE-${i}`,
      notionId: notionIds[i],
      createdAt: "2024-01-01T08:00:00.000Z",
      creatorAddress: ADDRESS_ALLOW_LIST[j % 2],
      content: `CONTENT-${i}-${j} lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      lastEditedAt: "2024-01-01T08:00:00.000Z",
    })),
    createdAt: "2024-01-01T08:00:00.000Z",
    creatorAddress: ADDRESS_ALLOW_LIST[0],
  };
});

function WrappedEditor(props: ComponentProps<typeof Editor>) {
  const {
    document: {
      state: {
        global: { issues },
      },
    },
  } = props;
  return (
    <div className="grid grid-cols-[1fr,auto] gap-4">
      <Scopes
        issue={null}
        issues={issues}
        scopes={mockScopes}
        selectedNotionId={null}
        tempIsDisplay
      />
      <div className="w-80">
        <Editor {...props} scopes={mockScopes} />
      </div>
    </div>
  );
}

const { meta, CreateDocumentStory: NotSignedIn } = createDocumentStory(
  WrappedEditor,
  reducer,
  utils.createExtendedState({
    state: {
      global: {
        issues: [],
      },
      local: {},
    },
  }),
  {
    user: undefined,
  },
);

const { CreateDocumentStory: NotOnAllowList } = createDocumentStory(
  WrappedEditor,
  reducer,
  utils.createExtendedState({
    state: {
      global: {
        issues: [],
      },
      local: {},
    },
  }),
  {
    user: {
      ...defaultMockUser,
      address: "0x0000000000000000000000000000000000000000",
    },
  },
);

const { CreateDocumentStory: AllowedUser } = createDocumentStory(
  WrappedEditor,
  reducer,
  utils.createExtendedState({
    state: {
      global: {
        issues: [],
      },
      local: {},
    },
  }),
  {
    user: {
      ...defaultMockUser,
      address: ADDRESS_ALLOW_LIST[0],
    },
  },
);

const { CreateDocumentStory: NotSignedInWithItems } = createDocumentStory(
  WrappedEditor,
  reducer,
  utils.createExtendedState({
    state: {
      global: {
        issues: mockIssues,
      },
      local: {},
    },
  }),
  {
    user: undefined,
  },
);

const { CreateDocumentStory: NotOnAllowListWithItems } = createDocumentStory(
  WrappedEditor,
  reducer,
  utils.createExtendedState({
    state: {
      global: {
        issues: mockIssues,
      },
      local: {},
    },
  }),
  {
    user: {
      ...defaultMockUser,
      address: "0x0000000000000000000000000000000000000000",
    },
  },
);

const { CreateDocumentStory: AllowedUserWithItems } = createDocumentStory(
  WrappedEditor,
  reducer,
  utils.createExtendedState({
    state: {
      global: {
        issues: mockIssues,
      },
      local: {},
    },
  }),
  {
    user: {
      ...defaultMockUser,
      address: ADDRESS_ALLOW_LIST[0],
    },
  },
);

export {
  NotSignedIn,
  NotOnAllowList,
  AllowedUser,
  NotSignedInWithItems,
  NotOnAllowListWithItems,
  AllowedUserWithItems,
};

export default { ...meta, title: "Atlas Feedback Issues" } as Meta<
  typeof Editor
>;
