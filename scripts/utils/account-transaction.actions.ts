import { IBaseDocumentDriveServer } from "document-drive/server";
import { actions as accountTransactionActions } from '../../document-models/account-transactions'
import { v4 as uuid } from "uuid";

export const addTransaction = (
    driveServer: IBaseDocumentDriveServer,
    driveId: string,
    documentId: string,
    transaction: any
) => {
    return driveServer.addAction(
        driveId,
        documentId,
        accountTransactionActions.createTransaction({
            id: uuid(),
            amount: Number(transaction.value),
            datetime: new Date(transaction.blockTimestamp).toISOString(),
            details: {
                crypto: {
                    txHash: transaction.txHash,
                    token: transaction.contract,
                    blockNumber: transaction.blockNumber,
                }
            },
            fromAccount: transaction.sender,
            toAccount: transaction.receiver,
            budget: ''
        })
    )
}