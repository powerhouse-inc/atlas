import {
  AtlasFeedbackIssuesState,
  AtlasFeedbackIssuesAction,
  AtlasFeedbackIssuesLocalState,
} from "document-models/atlas-feedback-issues";
import { ExtendedEditor } from "document-model-libs";
import {
  AtlasFeedbackIssuesEditor,
  AtlasFeedbackIssuesEditorCustomProps,
} from "./editor";
export const module: ExtendedEditor<
  AtlasFeedbackIssuesState,
  AtlasFeedbackIssuesAction,
  AtlasFeedbackIssuesLocalState,
  AtlasFeedbackIssuesEditorCustomProps
> = {
  Component: AtlasFeedbackIssuesEditor,
  documentTypes: ["makerdao/feedback-issues"],
  config: {
    id: "makerdao/feedback-issues",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
