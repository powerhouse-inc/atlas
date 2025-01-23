import { RWAEditorContextProps } from "@powerhousedao/design-system";
import type {
  RealWorldAssetsState,
  RealWorldAssetsLocalState,
  RealWorldAssetsAction,
} from "../../document-models/rwa-portfolio";
import { ExtendedEditor } from "document-model-libs";
import Editor from "./editor";
export const module: ExtendedEditor<
  RealWorldAssetsState,
  RealWorldAssetsAction,
  RealWorldAssetsLocalState,
  RWAEditorContextProps
> = {
  Component: Editor,
  documentTypes: ["makerdao/rwa-portfolio"],
  config: {
    id: "rwa-editor",
    disableExternalControls: true,
  },
};

export default module;
