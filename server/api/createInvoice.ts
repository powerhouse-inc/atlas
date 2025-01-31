import express from 'express';
import axios from 'axios';
import { executeTokenTransfer } from './gnosisTransactionBuilder'

const router = express.Router();

const API_URL = 'https://api.request.finance/invoices';
const API_KEY = process.env.REQUEST_FINANCE_API_KEY; // Store in .env file

router.post('/create-invoice', async (req, res) => {
    console.log('Getting a request to create an invoice');
    try {
        // First API call to create the invoice
        const response = await axios.post(API_URL, req.body, {
            headers: {
                "Authorization": `${API_KEY}`,
                'Content-Type': 'application/json',
                'X-Network': 'mainnet',
            },
        });

        console.log('Server: Invoice created successfully:', response.data.id);

        try {
            // Second API call to make it on-chain
            const onChainResponse = await axios.post(
                `https://api.request.finance/invoices/${response.data.id}`,
                {},
                {
                    headers: {
                        'Authorization': `${API_KEY}`,
                        'Content-Type': 'application/json',
                        'X-Network': 'mainnet',
                    },
                }
            );
            console.log('Server: Invoice made on-chain successfully:', onChainResponse.data.invoiceLinks);

            // Send the second API call's response back to the client
            res.json(onChainResponse.data);
        } catch (error) {
            console.error('Server: Error making invoice on-chain:', error);
        }

    } catch (error) {
        console.error('Error creating invoice: error.response', error.response.data);
        res.status(500).json({ error: 'Failed to create invoice', errors: error.response.data.errors });
    }
});

router.post('/transfer', async (req, res) => {
    try {
        const { payerWallet, paymentDetails } = req.body;
        const result = await executeTokenTransfer(payerWallet, paymentDetails);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 