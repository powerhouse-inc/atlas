import { RWAEditorContextProps } from "@powerhousedao/design-system";
import type {
  RealWorldAssetsState,
  RealWorldAssetsLocalState,
  RealWorldAssetsAction,
} from "../../document-models/rwa-portfolio";
import { lazyWithPreload } from "document-model-libs/utils";
import { ExtendedEditor } from "document-model-libs";

export const module: ExtendedEditor<
  RealWorldAssetsState,
  RealWorldAssetsAction,
  RealWorldAssetsLocalState,
  RWAEditorContextProps
> = {
  Component: lazyWithPreload(() => import("./editor")),
  documentTypes: ["makerdao/rwa-portfolio"],
  config: {
    id: "rwa-editor",
    disableExternalControls: true,
  },
};

export default module;
