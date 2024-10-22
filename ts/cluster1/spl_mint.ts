import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "./wallet/dev-wallet.json"
import { token } from "@coral-xyz/anchor/dist/cjs/utils";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("25AK1z81mbSAbrcBFi8LT4q3oKTX3hxVs8i9yijn6sAn");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey)
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, 1n * token_decimals)
        console.log(`Your mint txid: ${mintTx}`);
        
        // mint: 25AK1z81mbSAbrcBFi8LT4q3oKTX3hxVs8i9yijn6sAn
        // Your ata is: BEXq8aVTHyMiVRNA6C8fAGYWWYRvB6ZXNc97QYhY2KMu
        // Your mint txid: 35K3PvZDHduMAa64uveZuTTjabwxcxsxaYQc1ctW15NbpnEMCy3PhAy1ELmJnEjrJxtoTT8pX3928H19hRPeKJfZ

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
