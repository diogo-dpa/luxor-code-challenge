// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();

// Sample data arrays
const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Edward",
  "Fiona",
  "George",
  "Hannah",
  "Ian",
  "Julia",
  "Kevin",
  "Laura",
  "Michael",
  "Nina",
  "Oliver",
  "Paula",
  "Quinn",
  "Rachel",
  "Samuel",
  "Tina",
  "Ulrich",
  "Victoria",
  "William",
  "Xara",
  "Yves",
  "Zoe",
  "Adam",
  "Betty",
  "Carl",
  "Deborah",
];

const lastNames = [
  "Anderson",
  "Brown",
  "Clark",
  "Davis",
  "Evans",
  "Fisher",
  "Garcia",
  "Harris",
  "Jackson",
  "King",
  "Lewis",
  "Miller",
  "Nelson",
  "O'Connor",
  "Parker",
  "Quinn",
  "Roberts",
  "Smith",
  "Taylor",
  "Wilson",
  "Young",
  "Zhang",
  "Johnson",
  "Williams",
  "Jones",
  "Moore",
  "Martin",
  "Lee",
  "Thompson",
  "White",
];

const collectionNames = [
  "Vintage Cars",
  "Modern Art",
  "Ancient Coins",
  "Rare Books",
  "Classic Watches",
  "Abstract Paintings",
  "Sports Memorabilia",
  "Antique Furniture",
  "Digital Art",
  "Photography Collection",
  "Sculpture Garden",
  "Wine Collection",
  "Jewelry Box",
  "Comic Books",
  "Musical Instruments",
  "Historical Documents",
  "Pottery Collection",
  "Stamp Album",
  "Fashion Archive",
  "Technology Artifacts",
  "Nature Photography",
  "Urban Landscapes",
  "Portrait Series",
  "Contemporary Sculptures",
  "Ceramic Art",
  "Glass Collection",
  "Textile Art",
  "Metal Works",
  "Mixed Media",
  "Installation Art",
  "Video Art",
  "Performance Records",
  "Street Art",
  "Pop Art",
  "Minimalist Collection",
  "Baroque Replicas",
  "Renaissance Inspired",
  "Futuristic Designs",
  "Cultural Artifacts",
  "Scientific Instruments",
  "Astronomical Tools",
  "Mathematical Models",
  "Engineering Marvels",
  "Architectural Models",
  "Design Prototypes",
  "Innovation Showcase",
  "Creative Expressions",
  "Artistic Visions",
  "Masterpiece Collection",
  "Limited Editions",
];

const descriptions = [
  "A carefully curated collection of exceptional pieces",
  "Rare and valuable items from around the world",
  "Unique artifacts with rich historical significance",
  "Contemporary works by emerging artists",
  "Timeless classics that appreciate in value",
  "One-of-a-kind pieces from renowned creators",
  "Investment-grade collectibles with proven track records",
  "Exclusive items from private estates",
  "Museum-quality pieces available for private collection",
  "Handpicked selections from prestigious auctions",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function main() {
  console.log("Starting seed process...");

  // Create 10+ users
  console.log("Creating users...");
  const users = [];
  for (let i = 0; i < 15; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      },
    });
    users.push(user);
  }

  // Create 100+ collections
  console.log("Creating collections...");
  const collections = [];
  for (let i = 0; i < 110; i++) {
    const baseName = getRandomItem(collectionNames);
    const collection = await prisma.collection.create({
      data: {
        name: `${baseName} ${i + 1}`,
        description: getRandomItem(descriptions),
        stocks: getRandomNumber(1, 20),
        price: getRandomPrice(1000, 100000),
        userId: getRandomItem(users).id,
      },
    });
    collections.push(collection);
  }

  // Create 10+ bids per collection
  console.log("Creating bids...");
  const statuses = ["PENDING", "ACCEPTED", "REJECTED"];

  for (const collection of collections) {
    const numBids = getRandomNumber(10, 15);

    for (let j = 0; j < numBids; j++) {
      // Ensure bidder is not the collection owner
      let bidder;
      do {
        bidder = getRandomItem(users);
      } while (bidder.id === collection.userId);

      // Generate bid price around collection price
      const basePrice = collection.price;
      const bidPrice = getRandomPrice(
        basePrice * 0.8, // 80% to 120% of collection price
        basePrice * 1.2
      );

      await prisma.bid.create({
        data: {
          collectionId: collection.id,
          userId: bidder.id,
          price: bidPrice,
          status: getRandomItem(statuses),
          createdAt: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ), // Random date within last 30 days
        },
      });
    }
  }

  console.log("Seed data created successfully!");
  console.log(`Created ${users.length} users`);
  console.log(`Created ${collections.length} collections`);

  // Count total bids
  const totalBids = await prisma.bid.count();
  console.log(`Created ${totalBids} bids`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
