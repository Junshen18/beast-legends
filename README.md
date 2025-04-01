# Beast Legends NFT Marketplace

A modern, decentralized NFT marketplace built on Solana using Metaplex's Auction House program. This marketplace allows users to mint, list, and trade unique Beast Legends NFTs.

## 🌟 Features

- **NFT Minting**: Create unique Beast Legends NFTs
- **NFT Trading**: List and trade NFTs on the marketplace
- **Wallet Integration**: Seamless integration with Solana wallets
- **Real-time Updates**: Live updates for listings and transactions
- **Responsive Design**: Beautiful UI optimized for desktop viewing
- **IPFS Integration**: Decentralized storage for NFT metadata and images
- **Advanced Filtering**: Filter NFTs by price, rarity, and attributes
- **Grouped NFTs**: Smart grouping of identical NFTs with count display
- **Transaction History**: Track your NFT transactions and listings

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 with TypeScript
- **Blockchain**: Solana (Devnet)
- **NFT Standard**: Metaplex
- **Wallet Integration**: @solana/wallet-adapter
- **UI Components**: Tailwind CSS, Aceternity UI
- **Image Storage**: IPFS (via Pinata)
- **State Management**: React Hooks
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Solana CLI tools
- Phantom or any other Solana wallet

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/beast-legends.git
cd beast-legends
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
PINATA_API_KEY= 
PINATA_SECRET_API_KEY= 
ADMIN_PRIVATE_KEY= #not important for user to run the project
NEXT_PUBLIC_AUCTION_HOUSE_ADDRESS= #not important for user to run the project
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
beast-legends/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── marketplace/
│   │   │   │   ├── NFTGrid.tsx
│   │   │   │   ├── NFTCard.tsx
│   │   │   │   ├── ListingModal.tsx
│   │   │   │   └── FilterSection.tsx
│   │   │   ├── landing-page/
│   │   │   └── ui/
│   │   ├── marketplace/
│   │   ├── profile/
│   │   └── mint/
│   ├── styles/
│   └── utils/
├── public/
├── config/
└── package.json
```

## 🔧 Configuration

The marketplace is configured through the following files:

- `config/marketplace-config.json`: Contains marketplace settings
- `src/app/api/config/route.ts`: API endpoint for configuration
- Environment variables for network and contract addresses

```##

- All transactions are signed by the user's wallet
- IPFS URLs are properly converted to HTTP URLs
- Input validation for all user inputs
- Error handling for failed transactions
- Proper escrow handling for buyer funds

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Metaplex](https://metaplex.com/) for the Auction House program
- [Solana](https://solana.com/) for the blockchain infrastructure
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [AceternityUI](https://ui.aceternity.com/) for some ui components
- [Midjourney](https://www.midjourney.com/) for the illustration
```
