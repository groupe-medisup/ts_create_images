export function getPrompt({
  matiere,
  type,
  sousTheme = "",
}: {
  matiere: string;
  sousTheme?: string;
  type: "Cours" | "Colle" | "EBC";
}) {
  const moodAndLighting = {
    Cours: "calm, bright, pedagogical, clear and harmonious",
    Colle:
      "dynamic and focused, light tension, stronger contrasts, slight reflections, symbolizing knowledge testing",
    EBC: "solemn and competitive atmosphere, cool lighting, subtle metallic reflections, and abstract scientific elements like grids, curves, or data holograms symbolizing evaluation and ranking",
  };

  const color =
    type === "Cours"
      ? "soft blues, greens, and neutral tones for a calm and educational feel"
      : "dark academic tones, silver highlights, central glow or subtle halo";

  if (!moodAndLighting[type] || !color) {
    throw new Error("Invalid type or matiere");
  }

  return `Create an image of a highly detailed, photorealistic 3D render illustrating a medical concept from ${matiere} ${sousTheme}. 
No text, no logos, no human faces. The image must be scientifically and medically accurate — every anatomical, biological, or chemical structure should respect real medical observation standards from a medical school context.
 
Artistic style inspired by Pixar, Blender, and Unreal Engine — cinematic composition, realistic materials, soft depth of field, natural lighting (warm or cold depending on the subject). 
High-end medical illustration, both educational and immersive.
 
-- Mood and lighting : ${moodAndLighting[type]}
 
-- Visual composition:
Main subject (organ, molecule, tissue, or instrument) centered horizontally and vertically, occupying about 50% of the frame.
Clean visual balance that remains aesthetic and readable in both square (1:1) and panoramic (16:9) formats.
Edges (~15%) should include only blurred, textured background or secondary soft details.
Main subject can be slightly lower following the rule of thirds.
Background must be soft, textural, and deep, never flat or empty.
 
-- Color palette : ${color}
 
Technical details:
- Physically Based Rendering (PBR), true-to-scale realism.
- No cartoon effect or over-saturation.
- Depth of field: soft blur background, focus on the main scientific subject.
- Cohesive style with a professional collection of medical educational illustrations.`;
}
