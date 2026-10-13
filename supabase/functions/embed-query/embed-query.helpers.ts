const MODEL = "jina-embeddings-v3";
const DIMENSIONS = 384;
const JINA_URL = "https://api.jina.ai/v1/embeddings";

export { MODEL, DIMENSIONS };

export function parseVector(value: unknown): number[] | null {
  let parsed: unknown = value;

  if (typeof parsed === "string") {
    const trimmed = parsed.trim();
    if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;

    try {
      parsed = trimmed.slice(1, -1).split(",").map(Number);
    } catch {
      return null;
    }
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length !== DIMENSIONS ||
    parsed.some((item) =>
      typeof item !== "number" || !Number.isFinite(item)
    )
  ) {
    return null;
  }

  return parsed as number[];
}

export function vectorLiteral(values: number[]): string {
  if (
    values.length !== DIMENSIONS ||
    values.some((value) => !Number.isFinite(value))
  ) {
    throw new Error(`Expected ${DIMENSIONS} finite embedding values`);
  }

  return `[${values.join(",")}]`;
}

export async function createEmbedding(
  query: string,
  apiKey: string,
): Promise<number[]> {
  const response = await fetch(JINA_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: [query],
      dimensions: DIMENSIONS,
      task: "retrieval.query",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Jina embedding request failed (${response.status}): ${details.slice(0, 500)}`,
    );
  }

  const payload = await response.json();
  const embedding = payload?.data?.[0]?.embedding;

  if (
    !Array.isArray(embedding) ||
    embedding.length !== DIMENSIONS ||
    embedding.some((value: unknown) =>
      typeof value !== "number" || !Number.isFinite(value)
    )
  ) {
    throw new Error("Jina returned an invalid 384-dimensional embedding");
  }

  return embedding as number[];
}
