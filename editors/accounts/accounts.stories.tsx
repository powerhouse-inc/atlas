import Editor from "./editor";
import { createDocumentStory } from "document-model-libs/utils";
import { baseReducer, utils } from "document-model/document";

const { meta, CreateDocumentStory: Accounts } = createDocumentStory(
  Editor,
  (...args) => baseReducer(...args, (document) => document),
  utils.createExtendedState(),
);
export { Accounts };

export default { ...meta, title: "Accounts" };
