import {
  InvoiceState,
  InvoiceAction,
  LegalEntity,
  actions,
} from "../../../document-models/invoice";

interface UBLConverterConfig {
  dispatch: (action: InvoiceAction) => void;
}

export class UBLConverter {
  private dispatch: (action: InvoiceAction) => void;

  constructor(config: UBLConverterConfig) {
    this.dispatch = config.dispatch;
  }

  convertUBLToInvoice(ublXml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(ublXml, "text/xml");

    // Handle parsing errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error(`Invalid XML: ${parserError.textContent}`);
    }

    // Find Invoice element (handling potential namespace)
    const invoice = xmlDoc.querySelector("Invoice, ubl\\:Invoice");
    if (!invoice) {
      throw new Error("Invalid UBL document: No Invoice element found");
    }

    this.processGeneralData(invoice);
    this.processParties(invoice);
    this.processLineItems(invoice);
  }

  private getElementText(parent: Element, selector: string): string {
    const element = parent.querySelector(selector);
    return element ? element.textContent || "" : "";
  }

  private getElementTextList(parent: Element, selector: string): string[] {
    const elements = parent.querySelectorAll(selector);
    return Array.from(elements).map((el) => el.textContent || "");
  }

  private processGeneralData(invoice: Element) {
    // Process basic invoice data
    this.dispatch(
      actions.editInvoice({
        invoiceNo: this.getElementText(invoice, "ID, cbc\\:ID"),
        dateIssued: this.getElementText(invoice, "IssueDate, cbc\\:IssueDate"),
        dateDue: this.getElementText(invoice, "DueDate, cbc\\:DueDate"),
        dateDelivered:
          this.getElementText(
            invoice,
            "ActualDeliveryDate, cbc\\:ActualDeliveryDate",
          ) || null,
        currency: this.getElementText(
          invoice,
          "DocumentCurrencyCode, cbc\\:DocumentCurrencyCode",
        ),
      }),
    );

    //   // Process document references
    //   const refs = invoice.querySelectorAll(
    //     "AdditionalDocumentReference, cac\\:AdditionalDocumentReference",
    //   );
    //   refs.forEach((ref) => {
    //     this.dispatch(
    //       actions.addRef({
    //         id: this.getElementText(ref, "ID, cbc\\:ID"),
    //         value:
    //           this.getElementText(
    //             ref,
    //             "DocumentDescription, cbc\\:DocumentDescription",
    //           ) || this.getElementText(ref, "ID, cbc\\:ID"),
    //       }),
    //     );
    //   });
  }

  private processParties(invoice: Element) {
    // Process issuer (AccountingSupplierParty)
    const supplier = invoice.querySelector(
      "AccountingSupplierParty Party, cac\\:AccountingSupplierParty cac\\:Party",
    );
    if (supplier) {
      this.dispatch(
        actions.editIssuer({
          id: this.getElementText(
            supplier,
            "PartyIdentification ID, cac\\:PartyIdentification cbc\\:ID",
          ),
          name: this.getElementText(
            supplier,
            "PartyName Name, cac\\:PartyName cbc\\:Name",
          ),
          streetAddress: this.getElementText(
            supplier,
            "PostalAddress StreetName, cac\\:PostalAddress cbc\\:StreetName",
          ),
          city: this.getElementText(
            supplier,
            "PostalAddress CityName, cac\\:PostalAddress cbc\\:CityName",
          ),
          postalCode: this.getElementText(
            supplier,
            "PostalAddress PostalZone, cac\\:PostalAddress cbc\\:PostalZone",
          ),
          country: this.getElementText(
            supplier,
            "PostalAddress Country IdentificationCode, cac\\:PostalAddress cac\\:Country cbc\\:IdentificationCode",
          ),
          stateProvince: this.getElementText(
            supplier,
            "PostalAddress CountrySubentity, cac\\:PostalAddress cbc\\:CountrySubentity",
          ),
          tel: this.getElementText(
            supplier,
            "Contact Telephone, cac\\:Contact cbc\\:Telephone",
          ),
          email: this.getElementText(
            supplier,
            "Contact ElectronicMail, cac\\:Contact cbc\\:ElectronicMail",
          ),
        }),
      );

      // Process issuer bank details
      const financialAccount = supplier.querySelector(
        "FinancialAccount, cac\\:FinancialAccount",
      );
      if (financialAccount) {
        this.dispatch(
          actions.editIssuerBank({
            name: this.getElementText(
              financialAccount,
              "FinancialInstitutionBranch FinancialInstitution Name, cac\\:FinancialInstitutionBranch cac\\:FinancialInstitution cbc\\:Name",
            ),
            accountNum: this.getElementText(financialAccount, "ID, cbc\\:ID"),
            SWIFT: this.getElementText(
              financialAccount,
              "FinancialInstitutionBranch FinancialInstitution ID, cac\\:FinancialInstitutionBranch cac\\:FinancialInstitution cbc\\:ID",
            ),
          }),
        );
      }
    }

    // Process payer (AccountingCustomerParty)
    const customer = invoice.querySelector(
      "AccountingCustomerParty Party, cac\\:AccountingCustomerParty cac\\:Party",
    );
    if (customer) {
      this.dispatch(
        actions.editPayer({
          id: this.getElementText(
            customer,
            "PartyIdentification ID, cac\\:PartyIdentification cbc\\:ID",
          ),
          name: this.getElementText(
            customer,
            "PartyName Name, cac\\:PartyName cbc\\:Name",
          ),
          streetAddress: this.getElementText(
            customer,
            "PostalAddress StreetName, cac\\:PostalAddress cbc\\:StreetName",
          ),
          city: this.getElementText(
            customer,
            "PostalAddress CityName, cac\\:PostalAddress cbc\\:CityName",
          ),
          postalCode: this.getElementText(
            customer,
            "PostalAddress PostalZone, cac\\:PostalAddress cbc\\:PostalZone",
          ),
          country: this.getElementText(
            customer,
            "PostalAddress Country IdentificationCode, cac\\:PostalAddress cac\\:Country cbc\\:IdentificationCode",
          ),
          stateProvince: this.getElementText(
            customer,
            "PostalAddress CountrySubentity, cac\\:PostalAddress cbc\\:CountrySubentity",
          ),
          tel: this.getElementText(
            customer,
            "Contact Telephone, cac\\:Contact cbc\\:Telephone",
          ),
          email: this.getElementText(
            customer,
            "Contact ElectronicMail, cac\\:Contact cbc\\:ElectronicMail",
          ),
        }),
      );

      // Process payer bank details
      const financialAccount = customer.querySelector(
        "FinancialAccount, cac\\:FinancialAccount",
      );
      if (financialAccount) {
        this.dispatch(
          actions.editPayerBank({
            name: this.getElementText(
              financialAccount,
              "FinancialInstitutionBranch FinancialInstitution Name, cac\\:FinancialInstitutionBranch cac\\:FinancialInstitution cbc\\:Name",
            ),
            accountNum: this.getElementText(financialAccount, "ID, cbc\\:ID"),
            SWIFT: this.getElementText(
              financialAccount,
              "FinancialInstitutionBranch FinancialInstitution ID, cac\\:FinancialInstitutionBranch cac\\:FinancialInstitution cbc\\:ID",
            ),
          }),
        );
      }
    }
  }

  private processLineItems(invoice: Element) {
    const invoiceLines = invoice.querySelectorAll(
      "InvoiceLine, cac\\:InvoiceLine",
    );

    invoiceLines.forEach((line) => {
      const taxPercent =
        parseFloat(
          this.getElementText(
            line,
            "TaxTotal TaxSubtotal TaxCategory Percent, cac\\:TaxTotal cac\\:TaxSubtotal cac\\:TaxCategory cbc\\:Percent",
          ),
        ) || 0;

      const quantity = parseFloat(
        this.getElementText(line, "InvoicedQuantity, cbc\\:InvoicedQuantity"),
      );

      const unitPriceExcl = parseFloat(
        this.getElementText(
          line,
          "Price PriceAmount, cac\\:Price cbc\\:PriceAmount",
        ),
      );

      const unitPriceIncl = unitPriceExcl * (1 + taxPercent / 100);

      this.dispatch(
        actions.addLineItem({
          id: this.getElementText(line, "ID, cbc\\:ID"),
          description:
            this.getElementText(
              line,
              "Item Description, cac\\:Item cbc\\:Description",
            ) || this.getElementText(line, "Item Name, cac\\:Item cbc\\:Name"),
          taxPercent,
          quantity,
          currency:
            line
              .querySelector("Price PriceAmount, cac\\:Price cbc\\:PriceAmount")
              ?.getAttribute("currencyID") || "USD",
          unitPriceTaxExcl: unitPriceExcl,
          unitPriceTaxIncl: unitPriceIncl,
          totalPriceTaxExcl: quantity * unitPriceExcl,
          totalPriceTaxIncl: quantity * unitPriceIncl,
        }),
      );
    });
  }
}
