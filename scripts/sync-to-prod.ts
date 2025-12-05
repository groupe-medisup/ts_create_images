import { createClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types";

// Local Supabase
const localUrl = process.env.SUPABASE_URL!;
const localKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Production Supabase
const prodUrl = process.env.PROD_SUPABASE_URL!;
const prodKey = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY!;

if (!prodUrl || !prodKey) {
  console.error("Missing PROD_SUPABASE_URL or PROD_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const local = createClient<Database>(localUrl, localKey);
const prod = createClient<Database>(prodUrl, prodKey);

async function syncData() {
  console.log("📊 Syncing images table...");

  // Get all images from local
  const { data: localImages, error: fetchError } = await local
    .from("images")
    .select("*")
    .is("refused_at", null);

  if (fetchError) {
    throw new Error("Error fetching local images:", fetchError);
  }

  console.log(`Found ${localImages?.length || 0} images locally`);

  // Insert into production (upsert to avoid duplicates)
  if (localImages.length > 0) {
    const { error: insertError } = await prod
      .from("images")
      .upsert(localImages, { onConflict: "id" });

    if (insertError) {
      throw new Error("Error inserting to prod:", insertError);
    } else {
      console.log("✅ Images table synced");

      return localImages.map((image) => image.file_path);
    }
  }
}

async function syncStorage(filePaths: string[]) {
  console.log("\n 💾 Syncing storage bucket...");

  // Download and upload each file
  for (const filePath of filePaths) {
    console.log(`Syncing: ${filePath}`);

    // Get file metadata from local
    const { data: file, error: metaError } = await local.storage
      .from("images")
      .info(filePath);

    if (metaError || !file) {
      throw new Error(`Error fetching metadata for ${filePath}:`, metaError);
    }

    // Download from local
    const { data: fileData, error: downloadError } = await local.storage
      .from("images")
      .download(filePath);

    if (downloadError) {
      throw new Error(`Error downloading ${filePath}:`, downloadError);
    }

    // Upload to production
    const { error: uploadError } = await prod.storage
      .from("images")
      .upload(filePath, fileData, {
        upsert: true,
        contentType: file.metadata?.mimetype,
      });

    if (uploadError) {
      throw new Error(`Error uploading ${file.name}:`, uploadError);
    } else {
      console.log(`✅ ${file.name}`);
    }
  }

  console.log("✅ Storage synced");
}

async function main() {
  console.log("🚀 Starting sync from local to production\n");

  const filePaths = await syncData();
  await syncStorage(filePaths);

  console.log("\n✨ Sync complete!");
}

main().catch(console.error);
