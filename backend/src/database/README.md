# Database Directory

This directory contains all database-related files and configurations for the Blog Management API.

## 📁 Structure

```
src/database/
├── migrations/     # TypeORM migration files
│   ├── data-source.ts
│   ├── 1753720126276-InitSchema.ts
│   ├── 1753720126277-AddUserProfile.ts
│   └── README.md
└── Migrations.md   # This file
```

## 🗂️ Migrations

### Current Migrations (Applied)
- **1753720126276-InitSchema.ts** - Initial database schema setup
  - Creates users, posts, tags, and post_tags tables
  - Sets up foreign key relationships and constraints
  - Configures unique constraints for username, email, and tag names

- **1753720126277-AddUserProfile.ts** - Add UserProfile table and relationships
  - Creates user_profiles table with bio field
  - Establishes One-to-One relationship with User
  - Enables bio functionality for user profiles

### Migration Status
✅ **All migrations applied successfully**
- Database schema is up to date
- UserProfile functionality is active
- All relationships are properly configured

## 🚀 Migration Commands

### Generate New Migration
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:generate src/database/migrations/MigrationName -d src/database/migrations/data-source.ts
```

### Run Migrations
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/database/migrations/data-source.ts
```

### Show Migration Status
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:show -d src/database/migrations/data-source.ts
```

### Revert Last Migration
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:revert -d src/database/migrations/data-source.ts
```

### NPM Scripts (Recommended)
```bash
# Run migrations
npm run migration:run

# Generate new migration
npm run migration:generate -- src/database/migrations/MigrationName

# Show migration status
npm run migration:show
```

## 🔧 Configuration

### TypeORM CLI Configuration
- **data-source.ts** - Main TypeORM CLI configuration
  - Database connection settings
  - Explicit entity paths to avoid circular dependencies
  - Migration file paths

### Alternative Configuration
- **ormconfig.json** - Alternative CLI configuration
  - Points to `src/database/migrations/*.ts` for migration files

## 🗄️ Database Schema

### Tables Created
1. **users** - User accounts with authentication
2. **user_profiles** - User profile information with biography
3. **posts** - Blog posts with content and author
4. **tags** - Post tags with unique names
5. **post_tags** - Junction table for post-tag relationships

