-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genre" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"lang" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"uid" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"nickname" text NOT NULL,
	"avatar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres_on_songs" (
	"genre_id" integer NOT NULL,
	"song_id" integer NOT NULL,
	CONSTRAINT "genres_on_songs_pkey" PRIMARY KEY("genre_id","song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlist" (
	"user_id" bigint NOT NULL,
	"song_id" integer NOT NULL,
	"tags" text[],
	CONSTRAINT "playlist_pkey" PRIMARY KEY("user_id","song_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genres_on_songs" ADD CONSTRAINT "genres_on_songs_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genres_on_songs" ADD CONSTRAINT "genres_on_songs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist" ADD CONSTRAINT "playlist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist" ADD CONSTRAINT "playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uid") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_nickname_key" ON "user" USING btree ("nickname");
*/