# Luxor Code Challenge

A Next.js application for managing collections and bids with a PostgreSQL database.

## Prerequisites

Before running this project, make sure you have the following installed:

### Required Software

- **Node.js**: Version 18.0 or higher

  - Check version: `node --version`
  - Download from: [https://nodejs.org/](https://nodejs.org/)

- **npm**: Comes with Node.js

  - Check version: `npm --version`

- **Docker**: For running PostgreSQL database

  - Check version: `docker --version`
  - Download from: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

- **Docker Compose**: Usually included with Docker Desktop
  - Check version: `docker compose version`

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd luxor-code-challenge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create it manually with:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/luxor?schema=public"
```

### 4. Start the Database

Start PostgreSQL using Docker Compose:

```bash
npm run db:up:dev
```

This will start a PostgreSQL container on port 5432.

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Run Database Migrations

```bash
npm run db:migrate
```

### 7. Seed the Database (Optional)

To populate the database with sample data:

```bash
npm run db:seed
```

This will create:

- 15 users
- 110 collections
- 10-15 bids per collection

### 8. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
luxor-code-challenge/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Database seeding script
│   └── migrations/           # Database migration files
├── src/
│   ├── app/                  # Next.js 14 app router
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utility libraries
│   └── shared/               # Shared utilities and validations
├── public/                   # Static assets
├── docker-compose.yml        # Docker configuration
└── package.json             # Dependencies and scripts
```

## API Endpoints

### Collections

- `GET /api/collections` - List all collections
- `POST /api/collections` - Create a new collection
- `PUT /api/collections/[id]` - Update a collection
- `DELETE /api/collections/[id]` - Delete a collection

### Bids

- `GET /api/bids` - List all bids
- `POST /api/bids` - Create a new bid
- `PUT /api/bids/[id]` - Update a bid
- `DELETE /api/bids/[id]` - Delete a bid
- `PATCH /api/collections/[collection_id]/bids/[bid_id]` - Update bid status

### Users

- `GET /api/users` - List all users

### Reset Database

To completely reset the database:

```bash
npm run db:down:dev
npm run db:up:dev
npm run db:migrate
npm run db:seed
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn
- **Database**: PostgreSQL, Prisma ORM
- **Form Handling**: React Hook Form, Zod
- **Notifications**: Sonner
- **Development**: Docker, ESLint

## Answering questions:

- How would you monitor the application to ensure it is running smoothly?
  - I would think about adding DataDog to monitor interactions and logs.
- How would you address scalability and performance?
  - Focusing on implementing a cache layer with the native fetch API + NextJs tools or even adding React Query on it. If there is still an issue with the performance, I would think about migrating the REST API to a GraphQL, in order to decrease the payload of the requests.
- Trade-offs you had to choose when doing this challenge (the things you would do different with more time and resources)
  - I noticed it's happening some duplicate API calls for some actions, so I would analyze and optimize te flows.
  - I would add some unit tests.
  - Improve the UX with loading states and some CSS adjustments for responsiveness.

## License

This project is part of a code challenge and is for evaluation purposes.
