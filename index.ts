import algosdk from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import { config } from "dotenv";

config();

// Configuration: Localnet connection
const algodToken = "a".repeat(64);
const algodServer = "http://localhost";
const algodPort = 4001;

// Initialize Algorand client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const main = async () => {
  try {
    console.log("=== Start Script ===");

    const accountA = generateAccount();
    const accountB = generateAccount();

    console.log("Account A Address:", accountA.addr);
    console.log("Account B Address:", accountB.addr);

    const mnemonic = process.env.MNEMONIC || "";
    const funderAccount = algosdk.mnemonicToSecretKey(mnemonic);

    console.log("\nFunding accounts...");
    await fundAccount(accountA.addr, funderAccount);
    await fundAccount(accountB.addr, funderAccount);

    console.log("\nRekeying Account A to Account B...");
    await rekeyAccount(accountA, accountB);

    console.log("\nTransferring Algos from Account A to Account B...");
    await transferAlgos(accountA, accountB);

    console.log("=== Script Completed Successfully ===");
  } catch (err) {
    console.error("Error:", err);
  }
};

const generateAccount = () => {
  const account = algosdk.generateAccount();
  console.log("Generated Account:", account.addr);
  return account;
};

const fundAccount = async (receiver: string, funderAcct: algosdk.Account) => {
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: funderAcct.addr,
    to: receiver,
    amount: 10e6,
    suggestedParams: params,
  });

  const signedTxn = txn.signTxn(funderAcct.sk);
  const { txn: signed } = await algodClient.sendRawTransaction(signedTxn).do();
  await algosdk.waitForConfirmation(algodClient, signed.txID().toString(), 4);
  console.log(`Funded ${receiver} with 10 Algos`);
};

const rekeyAccount = async (
  accountA: algosdk.Account,
  accountB: algosdk.Account
) => {
  const params = await algodClient.getTransactionParams().do();

  const rekeyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: accountA.addr,
    to: accountA.addr,
    amount: 0,
    rekeyTo: accountB.addr,
    suggestedParams: params,
  });

  const signedRekeyTxn = rekeyTxn.signTxn(accountA.sk);
  const { txn: rekeyedTxn } = await algodClient
    .sendRawTransaction(signedRekeyTxn)
    .do();
  await algosdk.waitForConfirmation(
    algodClient,
    rekeyedTxn.txID().toString(),
    4
  );

  console.log("Account A rekeyed to Account B");
};

const transferAlgos = async (
  accountA: algosdk.Account,
  accountB: algosdk.Account
) => {
  const params = await algodClient.getTransactionParams().do();

  const accountAInfo = await algodClient.accountInformation(accountA.addr).do();
  const balanceA = accountAInfo.amount;

  const transferTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: accountA.addr,
    to: accountB.addr,
    amount: balanceA - 1000,
    suggestedParams: params,
  });

  const signedTransferTxn = transferTxn.signTxn(accountB.sk);
  await algodClient.sendRawTransaction(signedTransferTxn).do();
  await algosdk.waitForConfirmation(
    algodClient,
    transferTxn.txID().toString(),
    4
  );

  console.log("All Algos transferred from Account A to Account B");

  const finalBalanceA = await algodClient
    .accountInformation(accountA.addr)
    .do();
  const finalBalanceB = await algodClient
    .accountInformation(accountB.addr)
    .do();

  console.log("Final balance of Account A:", finalBalanceA.amount);
  console.log("Final balance of Account B:", finalBalanceB.amount);
};

main();
