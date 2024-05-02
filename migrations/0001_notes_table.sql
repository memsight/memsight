-- CreateTable
CREATE TABLE "notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "uri_hash" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "site_name" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "byline" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "text_content" TEXT NOT NULL,
    "markdown" TEXT NOT NULL,
    "published_at" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "opengraph" TEXT NOT NULL,
    "wait_timeout" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "created_at" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "idx_notes_user_id" ON "notes"("user_id");

-- CreateIndex
CREATE INDEX "idx_notes_uri_hash" ON "notes"("uri_hash");

-- CreateIndex
CREATE INDEX "idx_tokens_user_id" ON "tokens"("user_id");
