import Editor from "./editor";
import { createDocumentStory } from "document-model-libs/utils";
import { baseReducer, utils } from "document-model/document";

const { meta, CreateDocumentStory: AccountTransactions } = createDocumentStory(
  Editor,
  (...args) => baseReducer(...args, (document) => document),
  utils.createExtendedState(),
);
export { AccountTransactions };

export default { ...meta, title: "Account Transactions" };
