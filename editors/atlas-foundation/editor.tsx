import { Action, EditorProps } from "document-model/document";
import { Button } from "@powerhousedao/design-system";
import {
  EnumField,
  Form,
  StringField,
  UrlField,
} from "@powerhousedao/design-system/scalars";
import { AtlasFoundationArticleOperations } from "document-models/atlas-foundation/gen/article/operations";
import { useEffect } from "react";

export type IProps = EditorProps<
  unknown,
  Action,
  AtlasFoundationArticleOperations
>;

export default function Editor(props: IProps) {
  const { document, dispatch, context } = props;
  const {
    state: { global: state },
  } = document;

  useEffect(() => {
    console.log("State updated:", state);
  }, [state]);
  const handleSubmit = (values: Record<string, any>) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== null),
    );

    dispatch({
      type: "updateScopeOperation",
      input: filteredValues,
      scope: "global",
    });
  };

  return (
    <Form defaultValues={state as Record<string, any>} onSubmit={handleSubmit}>
      <StringField className="mb-4" disabled label="Name" name="name" />
      <StringField className="mb-4" disabled label="DocNo" name="docNo" />
      <EnumField
        className="mb-4"
        label="Status"
        name="masterStatus"
        options={[
          { value: "PLACEHOLDER", label: "PLACEHOLDER" },
          { value: "PROVISIONAL", label: "PROVISIONAL" },
          { value: "APPROVED", label: "APPROVED " },
          { value: "DEFERRED", label: "DEFERRED" },
          { value: "ARCHIVED", label: "ARCHIVED" },
        ]}
        variant="Select"
      />

      <EnumField
        className="mb-4"
        label="Atlas Type"
        name="atlasType"
        options={[
          { value: "ARTICLE", label: "ARTICLE" },
          { value: "SECTION", label: "SECTION" },
          { value: "CORE", label: "CORE " },
          {
            value: "ACTIVE_DATA_CONTROLLER",
            label: "ACTIVE_DATA_CONTROLLER",
          },
        ]}
        variant="Select"
      />

      <EnumField
        className="mb-4"
        label="Global Tags"
        multiple
        name="globalTags"
        options={[
          { value: "SCOPE_ADVISOR_", label: "SCOPE_ADVISOR_" },
          { value: "AVC_", label: "AVC_" },
          { value: "CAIS_", label: "CAIS_" },
          { value: "ML_LOW_PRIORITY_", label: "ML_LOW_PRIORITY_" },
          { value: "EXTERNAL_REFERENCE_", label: "EXTERNAL_REFERENCE_" },
          { value: "DAO_TOOLKIT_", label: "DAO_TOOLKIT_" },
          { value: "ML_DEFER_", label: "ML_DEFER_" },
          { value: "PURPOSE_SYSTEM_", label: "PURPOSE_SYSTEM_" },
          { value: "NEWCHAIN_", label: "NEWCHAIN_" },
          {
            value: "ML_SUPPORT_DOCS_NEEDED_",
            label: "ML_SUPPORT_DOCS_NEEDED_",
          },
          { value: "TWO_STAGE_BRIDGE_", label: "TWO_STAGE_BRIDGE_" },
          {
            value: "ECOSYSTEM_INTELLIGENCE_",
            label: "ECOSYSTEM_INTELLIGENCE_",
          },
          { value: "RECURSIVE_IMPROVEMENT_", label: "RECURSIVE_IMPROVEMENT_" },
          {
            value: "LEGACY_TERM_USE_APPROVED_",
            label: "LEGACY_TERM_USE_APPROVED_",
          },
        ]}
      />
      <StringField
        className="mb-4"
        disabled
        label="Content"
        multiline
        name="content"
      />
      <StringField
        className="mb-4"
        disabled
        label="Notion ID"
        name="notionId"
      />

      <div className="mb-4">
        <UrlField disabled label="Parent" name="parent" />
      </div>
      {/* <StringField className="mb-4" disabled label="Parent" name="parent" /> */}
      <div className="mb-4">
        <UrlField disabled label="Provenance" name="provenance" />
      </div>

      <StringField
        className="mb-4"
        disabled
        label="Original Content Data"
        name="originalContextData"
      />
      <StringField
        className="mb-4"
        disabled
        label="References"
        name="references"
      />
      <Button className="mt-4" type="submit">
        Submit
      </Button>
    </Form>
  );
}
