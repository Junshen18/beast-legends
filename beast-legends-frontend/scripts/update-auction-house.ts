// scripts/update-auction-house.ts
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from 'fs';
import dotenv from 'dotenv';
import bs58 from 'bs58';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function updateAuctionHouse() {
  try {
    console.log('Starting Auction House update...');

    // Load admin wallet from environment variable
    if (!process.env.ADMIN_PRIVATE_KEY) {
      throw new Error('ADMIN_PRIVATE_KEY not found in environment variables');
    }

    const privateKey = bs58.decode(process.env.ADMIN_PRIVATE_KEY);
    const adminKeypair = Keypair.fromSecretKey(privateKey);

    console.log('Admin public key:', adminKeypair.publicKey.toString());

    // Connect to Solana
    const connection = new Connection(clusterApiUrl("devnet"));
    console.log('Connected to Solana devnet');

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(adminKeypair));

    // Load existing auction house address from config
    const config = JSON.parse(fs.readFileSync('./config/marketplace-config.json', 'utf-8'));
    const auctionHouseAddress = new PublicKey(config.auctionHouseAddress);

    console.log('Updating Auction House at address:', auctionHouseAddress.toString());
    
    // Find the existing auction house
    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: auctionHouseAddress });

    // Update the auction house settings
    const updatedAuctionHouse = await metaplex
      .auctionHouse()
      .update({
        auctionHouse,
        sellerFeeBasisPoints: 500, // 5% fee
        requiresSignOff: false,
        canChangeSalePrice: true,
      });

    console.log('Auction House updated successfully!');
    console.log('Address:', updatedAuctionHouse.auctionHouse.toString());

    // Update the configuration
    const updatedConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      sellerFeeBasisPoints: 500
    };

    // Save updated config to file
    fs.writeFileSync(
      './config/marketplace-config.json',
      JSON.stringify(updatedConfig, null, 2)
    );

    console.log('Configuration updated in config/marketplace-config.json');

  } catch (error) {
    console.error('Error updating Auction House:', error);
    process.exit(1);
  }
}

updateAuctionHouse();