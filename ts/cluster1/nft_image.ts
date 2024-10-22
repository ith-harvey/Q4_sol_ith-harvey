import wallet from "./wallet/dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile, readFileSync } from "fs"
import path from "path"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {

        // const imagePath = path.join(__dirname, 'rug_nft.png');
        // console.log("Attempting to read file:", imagePath);

        // const imagePath = path.join(__dirname, '..', 'generated', 'rug_nft.png');
        // const image = await readFile(imagePath);

        //1. Load image
        const image = await readFileSync('cluster1/rug_nft.png');
        
        //2. Convert image to generic file.
        const genericFile = await createGenericFile(image, "rug_nft.png");
        // //3. Upload image
        const [myUri] = await umi.uploader.upload([genericFile]);

        console.log(myUri);
        console.log("done");


    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
