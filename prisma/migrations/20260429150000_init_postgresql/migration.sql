-- CreateTable users
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "educationalInstitution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable test_results
CREATE TABLE IF NOT EXISTS "test_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "riasecScores" JSONB NOT NULL,
    "riasecPercentages" JSONB NOT NULL,
    "hollandCode" TEXT NOT NULL,
    "professions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "test_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex for phone uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_key" ON "users"("phone");

-- CreateIndex for test results query
CREATE INDEX IF NOT EXISTS "test_results_userId_idx" ON "test_results"("userId");
