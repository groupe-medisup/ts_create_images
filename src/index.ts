import { readFile, writeFile } from "fs/promises";
import { getPrompt, ImageType } from "./prompt";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/database.types";

const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function cleanString(input: string) {
  return input.replace(/\s+/g, "_").toLowerCase();
}

async function saveImage({
  base64,
  model,
  type,
  matiere,
  subject,
}: {
  base64: string;
  model: string;
  type: "cours" | "colle" | "EBC";
  matiere: string;
  subject: string;
}) {
  const matches = base64.match(/^data:image\/png;base64,(.+)$/);
  const base64Data = matches ? matches[1] : base64;
  const buffer = Buffer.from(base64Data, "base64");
  // await writeFile(outputPath, new Uint8Array(buffer));
  // console.log(`Image saved to ${outputPath}`);

  const imageName = `${model}/${type}_${cleanString(matiere)}_${cleanString(
    subject
  )}-${Date.now()}`;

  const resultStorage = await client.storage
    .from("images")
    .upload(`${imageName}.png`, buffer, {
      contentType: "image/png",
    });

  console.log("Upload result:", resultStorage);

  if (resultStorage.error) {
    throw resultStorage.error;
  }

  const dataToInsert: Database["public"]["Tables"]["images"]["Insert"] = {
    file_path: resultStorage.data.path,
    type,
    matiere,
    subject,
    generated_by_model: model,
  };
  const resultDb = await client
    .from("images")
    .insert(dataToInsert)
    .select("*")
    .single();

  console.log("DB insert result:", resultDb);

  if (resultDb.error) {
    throw resultDb.error;
  }
}

async function main() {
  // const fileData = await readFile("input/generated_image.png", "base64");
  // await saveBase64Image(fileData, "output/generated_image.png");

  const data = await readFile("input/test_data.txt", "utf-8");
  const lines = data.split("\n").filter((line) => line.trim() !== "");

  // Get only the first line for testing
  const courseData = [
    lines.map((line) => {
      const [matiere, subject] = line.split("||").map((part) => part.trim());
      return { matiere, subject };
    })[0],
  ];

  // const model = "google/gemini-2.5-flash-image-preview";
  // const model = "google/gemini-3-pro-image-preview";
  // const model = "openai/gpt-5-image";
  const models = ["black-forest-labs/flux.2-pro"];

  // const courseData = lines.map((line) => {
  //   const [matiere, subject] = line.split("||").map((part) => part.trim());
  //   return { matiere, subject };
  // });

  for (const model of models) {
    for (const { matiere, subject } of courseData) {
      console.log(`Generating Cours image for ${matiere} - ${subject}`);
      await generateImage({ matiere, subject, type: "cours", model });
    }

    // const examData = [...new Set(courseData.map(({ matiere }) => matiere))];

    // for (const matiere of examData) {
    //   console.log(`Generating Colle image for ${matiere}`);
    //   await generateImage({ matiere, type: "colle" });

    //   console.log(`Generating EBC image for ${matiere}`);
    //   await generateImage({ matiere, type: "EBC" });
    // }
  }
}

async function generateImage({
  matiere,
  type,
  model,
  subject = "",
}: {
  matiere: string;
  subject?: string;
  type: ImageType;
  model: string;
}) {
  console.log("Generating image...");

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: getPrompt({ type, matiere, subject }),
          },
        ],
        modalities: ["image", "text"],
        image_config: {
          aspect_ratio: "16:9",
        },
      }),
    }
  );
  console.log(`Response status: ${response.status}`);
  const result = await response.json();
  console.log("Response received");

  // console.dir(result, { depth: null });

  if (!result.choices) {
    console.dir(result, { depth: null });
    throw new Error("🚨 No choices in response");
  }

  for (const { message } of result.choices) {
    if (!message.images) {
      console.error("🚨 No images in message", message);
      continue;
    }

    for (const image of message.images) {
      const imageUrl = image.image_url.url;

      // await writeFile(`${imageName}.txt`, imageUrl);

      await saveImage({
        base64: imageUrl,
        model,
        type,
        matiere,
        subject,
      });
    }
  }
}

main();
