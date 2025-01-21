import { ExtendedEditor, EditorContextProps } from "document-model-libs";
import Editor from "./editor";
import { AtlasScopeScopeOperations } from "document-models/atlas-scope/gen/scope/operations";

export const module: ExtendedEditor<unknown, Action, AtlasScopeScopeOperations, EditorContextProps> = {
  Component: Editor,
  documentTypes: ["sky/atlas-scope"],
  config: {
    id: "editor-id",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
