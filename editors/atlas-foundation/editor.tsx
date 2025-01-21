import { Action, EditorProps } from "document-model/document";
import { Button } from "@powerhousedao/design-system";
import {
  EnumField,
  Form,
  StringField,
  UrlField,
} from "@powerhousedao/design-system/dist/scalars";
import { AtlasFoundationArticleOperations } from "document-models/atlas-foundation/gen/article/operations";
import { actions } from "../../document-models/atlas-foundation";
import { useEffect } from 'react';

export type IProps = EditorProps<unknown, Action, AtlasFoundationArticleOperations>;

export default function Editor(props: IProps) {
  const { document, dispatch, context } = props;
  const {
    state: { global: state },
  } = document;

  useEffect(() => {
    console.log('State updated:', state);
  }, [state]);

  const handleSubmit = (values: Record<string, any>) => {
    console.log('Values:', values);
    // Check if masterStatus or globalTags have changed
    if (values.masterStatus !== state.masterStatus) {
      dispatch(
        actions.updateFoundation({
          masterStatus: values.masterStatus,
          atlasType: values.atlasType
        })
      );
      return;
    }

    if (values.globalTags !== state.globalTags) {
      dispatch(
        actions.updateFoundation({
          globalTags: values.globalTags,
          atlasType: values.atlasType
        })
      );
      return;
    }
  };

  return (
    <Form defaultValues={state as Record<string, any>} onSubmit={handleSubmit}>
      <StringField className="mb-4" disabled label="Name" name="name" />
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

      <StringField className="mb-4" disabled label="DocNo" name="docNo" />
      <StringField
        className="mb-4"
        disabled
        label="Content"
        multiline
        name="content"
      />
      <div className="mb-4">
        <UrlField disabled label="Provenance" name="provenance" />
      </div>
      <StringField
        className="mb-4"
        disabled
        label="Original Content Data"
        name="originalContextData"
      />
      <EnumField
        className="mb-4"
        label="Global Tags"
        multiple
        name="globalTags"
        options={[
          { label: "SCOPE_ADVISOR", value: "SCOPE_ADVISOR" },
          { label: "AVC", value: "AVC" },
          { label: "CAIS", value: "CAIS" },
          { label: "ML_LOW_PRIORITY", value: "ML_LOW_PRIORITY" },
          { label: "EXTERNAL_REFERENCE", value: "EXTERNAL_REFERENCE" },
          { label: "DAO_TOOLKIT", value: "DAO_TOOLKIT" },
          { label: "ML_DEFER", value: "ML_DEFER" },
          { label: "PURPOSE_SYSTEM", value: "PURPOSE_SYSTEM" },
          { label: "NEWCHAIN", value: "NEWCHAIN" },
          { label: "ML_SUPPORT_DOCS_NEEDED", value: "ML_SUPPORT_DOCS_NEEDED" },
          { label: "TWO_STAGE_BRIDGE", value: "TWO_STAGE_BRIDGE" },
          { label: "ECOSYSTEM_INTELLIGENCE", value: "ECOSYSTEM_INTELLIGENCE" },
          { label: "RECURSIVE_IMPROVEMENT", value: "RECURSIVE_IMPROVEMENT" },
          { label: "LEGACY_TERM_USE_APPROVED", value: "LEGACY_TERM_USE_APPROVED" },
        ]}
      />
      <StringField
        className="mb-4"
        disabled
        label="Notion ID"
        name="notionId"
      />
      <Button className="mt-4" type="submit">
        Submit
      </Button>
    </Form>
  );
}
