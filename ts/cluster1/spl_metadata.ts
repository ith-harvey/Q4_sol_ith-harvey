import wallet from "./wallet/dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import bs58 from 'bs58';

// Define our Mint address
const mint = publicKey("25AK1z81mbSAbrcBFi8LT4q3oKTX3hxVs8i9yijn6sAn")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer,
            updateAuthority: signer,
            payer: signer,
        }

        let data: DataV2Args = {
            name: "Rugdaddy",
            symbol: "RUG",
            uri: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));

        // 2WhL667MQUfTXnikaZ8HhhrXt79y9x4SUqHxuX4aBzZbWCxPKbpkUdczxKJHLXKFNKpTgyJNV33jbGpnnN9DxC71

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
