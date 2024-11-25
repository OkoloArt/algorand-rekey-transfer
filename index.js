"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var algosdk_1 = require("algosdk");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Configuration: Localnet connection
var algodToken = "a".repeat(64);
var algodServer = "http://localhost";
var algodPort = 4001;
// Initialize Algorand client
var algodClient = new algosdk_1.default.Algodv2(algodToken, algodServer, algodPort);
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var accountA, accountB, mnemonic, funderAccount, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log("=== Start Script ===");
                accountA = generateAccount();
                accountB = generateAccount();
                console.log("Account A Address:", accountA.addr);
                console.log("Account B Address:", accountB.addr);
                mnemonic = process.env.MNEMONIC || "";
                funderAccount = algosdk_1.default.mnemonicToSecretKey(mnemonic);
                console.log("\nFunding accounts...");
                return [4 /*yield*/, fundAccount(accountA.addr, funderAccount)];
            case 1:
                _a.sent();
                return [4 /*yield*/, fundAccount(accountB.addr, funderAccount)];
            case 2:
                _a.sent();
                console.log("\nRekeying Account A to Account B...");
                return [4 /*yield*/, rekeyAccount(accountA, accountB)];
            case 3:
                _a.sent();
                console.log("\nTransferring Algos from Account A to Account B...");
                return [4 /*yield*/, transferAlgos(accountA, accountB)];
            case 4:
                _a.sent();
                console.log("=== Script Completed Successfully ===");
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error("Error:", err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var generateAccount = function () {
    var account = algosdk_1.default.generateAccount();
    console.log("Generated Account:", account.addr);
    return account;
};
var fundAccount = function (receiver, funderAcct) { return __awaiter(void 0, void 0, void 0, function () {
    var params, txn, signedTxn, signed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, algodClient.getTransactionParams().do()];
            case 1:
                params = _a.sent();
                txn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                    from: funderAcct.addr,
                    to: receiver,
                    amount: 10e6,
                    suggestedParams: params,
                });
                signedTxn = txn.signTxn(funderAcct.sk);
                return [4 /*yield*/, algodClient.sendRawTransaction(signedTxn).do()];
            case 2:
                signed = (_a.sent()).txn;
                return [4 /*yield*/, algosdk_1.default.waitForConfirmation(algodClient, signed.txID().toString(), 4)];
            case 3:
                _a.sent();
                console.log("Funded ".concat(receiver, " with 10 Algos"));
                return [2 /*return*/];
        }
    });
}); };
var rekeyAccount = function (accountA, accountB) { return __awaiter(void 0, void 0, void 0, function () {
    var params, rekeyTxn, signedRekeyTxn, rekeyedTxn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, algodClient.getTransactionParams().do()];
            case 1:
                params = _a.sent();
                rekeyTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                    from: accountA.addr,
                    to: accountA.addr,
                    amount: 0,
                    rekeyTo: accountB.addr,
                    suggestedParams: params,
                });
                signedRekeyTxn = rekeyTxn.signTxn(accountA.sk);
                return [4 /*yield*/, algodClient
                        .sendRawTransaction(signedRekeyTxn)
                        .do()];
            case 2:
                rekeyedTxn = (_a.sent()).txn;
                return [4 /*yield*/, algosdk_1.default.waitForConfirmation(algodClient, rekeyedTxn.txID().toString(), 4)];
            case 3:
                _a.sent();
                console.log("Account A rekeyed to Account B");
                return [2 /*return*/];
        }
    });
}); };
var transferAlgos = function (accountA, accountB) { return __awaiter(void 0, void 0, void 0, function () {
    var params, accountAInfo, balanceA, transferTxn, signedTransferTxn, finalBalanceA, finalBalanceB;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, algodClient.getTransactionParams().do()];
            case 1:
                params = _a.sent();
                return [4 /*yield*/, algodClient.accountInformation(accountA.addr).do()];
            case 2:
                accountAInfo = _a.sent();
                balanceA = accountAInfo.amount;
                transferTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                    from: accountA.addr,
                    to: accountB.addr,
                    amount: balanceA - 1000,
                    suggestedParams: params,
                });
                signedTransferTxn = transferTxn.signTxn(accountB.sk);
                return [4 /*yield*/, algodClient.sendRawTransaction(signedTransferTxn).do()];
            case 3:
                _a.sent();
                return [4 /*yield*/, algosdk_1.default.waitForConfirmation(algodClient, transferTxn.txID().toString(), 4)];
            case 4:
                _a.sent();
                console.log("All Algos transferred from Account A to Account B");
                return [4 /*yield*/, algodClient
                        .accountInformation(accountA.addr)
                        .do()];
            case 5:
                finalBalanceA = _a.sent();
                return [4 /*yield*/, algodClient
                        .accountInformation(accountB.addr)
                        .do()];
            case 6:
                finalBalanceB = _a.sent();
                console.log("Final balance of Account A:", finalBalanceA.amount);
                console.log("Final balance of Account B:", finalBalanceB.amount);
                return [2 /*return*/];
        }
    });
}); };
main();
