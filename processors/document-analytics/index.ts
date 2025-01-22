import { generateId } from "document-model/utils";
import {
  AnalyticsProcessor,
  ProcessorOptions,
  ProcessorUpdate,
  AnalyticsPath,
} from "@powerhousedao/reactor-api";
import {
  AddFileInput,
  DocumentDriveDocument,
} from "document-model-libs/document-drive";
import { DateTime } from "luxon";

type DocumentType = DocumentDriveDocument;

export class DocumentAnalyticsProcessor extends AnalyticsProcessor<DocumentType> {
  protected processorOptions: ProcessorOptions = {
    listenerId: generateId(),
    filter: {
      branch: ["main"],
      documentId: ["*"],
      documentType: ["powerhouse/document-drive"],
      scope: ["global"],
    },
    block: false,
    label: "document-analytics",
    system: true,
  };

  async onStrands(strands: ProcessorUpdate<DocumentType>[]): Promise<void> {
    if (strands.length === 0) {
      return;
    }

    for (const strand of strands) {
      if (strand.operations.length === 0) {
        continue;
      }

      const firstOp = strand.operations[0];
      const source = AnalyticsPath.fromString(
        `ph/${strand.driveId}/${strand.documentId}/${strand.branch}/${strand.scope}`,
      );
      if (firstOp.index === 0) {
        await this.clearSource(source);
      }

      for (const operation of strand.operations) {
        console.log(">>> ", operation.type);
        const input = operation.input as AddFileInput;
        if (operation.type === "ADD_FILE") {
          await this.analyticsStore.addSeriesValue({
            source,
            start: DateTime.fromISO(operation.timestamp),
            metric: "DocumentCount",
            unit: input.documentType.split("/")[1],
            value: 1,
            dimensions: {
              "document-type": AnalyticsPath.fromString(
                `ph/document-type/${input.documentType}`,
              ),
              "document-drive": AnalyticsPath.fromString(
                `ph/drive/${strand.driveId}`,
              ),
            },
          });
        }
      }
    }
  }

  async onDisconnect() {}

  private async clearSource(source: AnalyticsPath) {
    try {
      await this.analyticsStore.clearSeriesBySource(source, true);
    } catch (e) {
      console.error(e);
    }
  }
}
