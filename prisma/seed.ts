import {PrismaClient} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    await prisma.transaction.deleteMany({});
    await prisma.memecoin.deleteMany({});
    await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            name: 'Test User 1',
            email: 'user1@example.com',
            password: hashedPassword,
            zthBalance: 100,
        }
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Test User 2',
            email: 'user2@example.com',
            password: hashedPassword,
            zthBalance: 100,
        }
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'Test User 3',
            email: 'user3@example.com',
            password: hashedPassword,
            zthBalance: 100,
        }
    });

    console.log(`Created 3 test users: ${user1.email}, ${user2.email}, ${user3.email}`);

    const memecoins = [
        {
            name: "Bitcoin",
            symbol: "BTC",
            description: "The original cryptocurrency and the largest by market capitalization",
            logoUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Ethereum",
            symbol: "ETH",
            description: "A decentralized platform that enables smart contracts and dApps",
            logoUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Dogecoin",
            symbol: "DOGE",
            description: "Much wow, very coin. Started as a meme, now a top cryptocurrency",
            logoUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/doge.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Shiba Inu",
            symbol: "SHIB",
            description: "The Dogecoin killer, a decentralized meme token",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/shib.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Cardano",
            symbol: "ADA",
            description: "A proof-of-stake blockchain platform with a focus on sustainability",
            logoUrl: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ada.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Solana",
            symbol: "SOL",
            description: "A high-performance blockchain supporting smart contracts and dApps",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/sol.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Polkadot",
            symbol: "DOT",
            description: "A multi-chain network that enables different blockchains to transfer messages and value",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/dot.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            description: "A decentralized oracle network that provides real-world data to smart contracts",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/link.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Uniswap",
            symbol: "UNI",
            description: "A decentralized exchange protocol built on Ethereum",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/uni.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Pepe",
            symbol: "PEPE",
            description: "A memecoin based on the popular Pepe the Frog meme",
            logoUrl: "https://cdn.jsdelivr.net/gh/ErikThiart/cryptocurrency-icons/128/pepe.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Avalanche",
            symbol: "AVAX",
            description: "A platform for decentralized applications and custom blockchain networks",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/avax.png",
            price: 0.1,
            supply: 0
        },
        {
            name: "Polygon",
            symbol: "MATIC",
            description: "A protocol and framework for building and connecting Ethereum-compatible blockchain networks",
            logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/matic.png",
            price: 0.1,
            supply: 0
        }
    ];

    for (const memecoin of memecoins) {
        const reserve = 0;

        await prisma.memecoin.create({
            data: {
                ...memecoin,
                reserve
            }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
