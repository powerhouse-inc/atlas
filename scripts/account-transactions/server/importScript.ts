import {
    addDocument,
    addFolder,
    createReactorAndCreateLocalDrive,
    sleep,
} from "scripts/utils/drive-actions";
import { addTransaction } from "scripts/utils/account-transaction.actions";
import { IBaseDocumentDriveServer } from "document-drive";
import incomingTransactions from './data/transactions.json';

interface ERC20Transfer {
    txHash: string;
    // Add other properties as needed
}

interface TransactionData {
    erc20Transfers: ERC20Transfer[];
}

export const importTransactions = async (incomingTransactions: TransactionData): Promise<void> => {
    try {
        console.time('import-duration');

        const driveServer = (await createReactorAndCreateLocalDrive(
            "http://localhost:4001/d/powerhouse"
        )) as IBaseDocumentDriveServer;

        const driveIds = await driveServer.getDrives();
        if (!driveIds.length) {
            throw new Error("No drives found");
        }

        const driveId = driveIds[0];
        let drive = await driveServer.getDrive(driveId);

        // Ensure Account Transactions folder exists
        const accountTransactionsDir = drive.state.global.nodes.find(
            (e: any) => e.name === "Account Transactions"
        );

        if (!accountTransactionsDir) {
            await addFolder(driveServer, driveId, "account-transactions", "Account Transactions");
            drive = await driveServer.getDrive(driveId);
        }

        const rootDirId = drive.state.global.nodes.find(
            (e: any) => e.name === "Account Transactions"
        );

        if (!rootDirId) {
            throw new Error("Failed to create or find Account Transactions directory");
        }

        // Ensure transactions document exists
        const transactionsDoc = drive.state.global.nodes.find(
            (e: any) => e.name === "Transactions"
        );

        if (!transactionsDoc) {
            console.log('Creating Transactions Document...');
            await addDocument(
                driveServer,
                driveId,
                "transactions",
                "Transactions",
                "powerhouse/account-transactions",
                rootDirId.id
            );
            await sleep(2000); // Allow time for document creation
        }

        await sleep(2500);
        // Get current transactions from document
        const document = await driveServer.getDocument(driveId, 'transactions');
        const docTransactions = (document.state.global as any).transactions || [];

        // Process new transactions
        const newTransactions = incomingTransactions.erc20Transfers.filter(transaction => {
            return !docTransactions.some((docTx: any) =>
                docTx.details.crypto.txHash === transaction.txHash
            );
        });

        if (newTransactions.length > 0) {
            console.log(`Adding ${newTransactions.length} new transactions to document`);

            // Process transactions in batches to avoid overwhelming the server
            const batchSize = 10;
            for (let i = 0; i < newTransactions.length; i += batchSize) {
                const batch = newTransactions.slice(i, i + batchSize);
                await Promise.all(
                    batch.map((transaction: any) => {
                        console.log(transaction.txHash);
                        addTransaction(driveServer, driveId, 'transactions', transaction);
                    })
                );
                if (i + batchSize < newTransactions.length) {
                    await sleep(1000); // Brief pause between batches
                }
            }
        } else {
            console.log('No new transactions to add');
        }

        await sleep(1000);
        console.timeEnd('import-duration');
    } catch (error) {
        console.error('Error in importTransactions:', error);
        throw error; // Re-throw to be caught by the caller if needed
    }
};

// await importTransactions(incomingTransactions);