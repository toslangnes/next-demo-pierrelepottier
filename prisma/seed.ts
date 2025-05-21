import {PrismaClient} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { SLOPE, STARTING_PRICE } from '../lib/trading.types';

const prisma = new PrismaClient();

async function main() {
    // Delete transactions first to avoid foreign key constraint issues
    await prisma.transaction.deleteMany({});
    // Then delete memecoins
    await prisma.memecoin.deleteMany({});
    // Finally delete users
    await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await prisma.user.create({
        data: {
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            zthBalance: 100,
        }
    });

    console.log(`Created test user: ${testUser.email}`);

    const memecoins = [
        {
            name: "Memecoin 1",
            symbol: "MC1",
            description: "The first memecoin in our collection",
            logoUrl: "https://picsum.photos/seed/memecoin1/200/200",
            price: 0.0042,
            supply: 20
        },
        {
            name: "Doge Coin",
            symbol: "DOGE",
            description: "Much wow, very coin",
            logoUrl: "https://picsum.photos/seed/dogecoin/200/200",
            price: 0.0123,
            supply: 25
        },
        {
            name: "Moon Rocket",
            symbol: "MOON",
            description: "To the moon! 🚀",
            logoUrl: "https://picsum.photos/seed/mooncoin/200/200",
            price: 0.0007,
            supply: 30
        },
        {
            name: "Pepe Coin",
            symbol: "PEPE",
            description: "Rare Pepe collection",
            logoUrl: "https://picsum.photos/seed/pepecoin/200/200",
            price: 0.0003,
            supply: 15
        },
        {
            name: "Cat Token",
            symbol: "MEOW",
            description: "For cat lovers everywhere",
            logoUrl: "https://picsum.photos/seed/catcoin/200/200",
            price: 0.0056,
            supply: 22
        },
        {
            name: "Diamond Hands",
            symbol: "DMND",
            description: "HODL forever",
            logoUrl: "https://picsum.photos/seed/diamondcoin/200/200",
            price: 0.0089,
            supply: 18
        }
    ];

    for (const memecoin of memecoins) {
        // Calculate reserve based on bonding curve formula
        const supply = memecoin.supply;
        const reserve = SLOPE * (supply ** 2) / 2 + STARTING_PRICE * supply;

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
