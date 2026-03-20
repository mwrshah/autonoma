import { GoogleGenAI, Type } from "@google/genai";

const MODEL_ID = "gemini-2.0-flash-lite";

let cachedClient: GoogleGenAI | null = null;

function getClient(apiKey: string): GoogleGenAI {
	if (cachedClient) return cachedClient;
	cachedClient = new GoogleGenAI({ apiKey });
	return cachedClient;
}

export type GeminiClassifyResult = {
	workstream_id: string | null;
	new_workstream_name: string | null;
	is_work_message: boolean;
};

const RESPONSE_SCHEMA = {
	type: Type.OBJECT,
	properties: {
		workstream_id: {
			type: Type.STRING,
			description: "ID of the existing workstream this message belongs to, or null",
			nullable: true,
		},
		new_workstream_name: {
			type: Type.STRING,
			description: "Name for a new workstream if this message starts new work, or null",
			nullable: true,
		},
		is_work_message: {
			type: Type.BOOLEAN,
			description: "True if this is a work-related message, false for casual/non-work chat",
		},
	},
	required: ["workstream_id", "new_workstream_name", "is_work_message"],
} as const;

export async function callGeminiClassify(
	apiKey: string,
	prompt: string,
): Promise<GeminiClassifyResult> {
	const client = getClient(apiKey);
	const response = await client.models.generateContent({
		model: MODEL_ID,
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: RESPONSE_SCHEMA,
			temperature: 0,
		},
	});

	const text = response.text;
	if (!text) {
		return { workstream_id: null, new_workstream_name: null, is_work_message: false };
	}

	const parsed = JSON.parse(text) as GeminiClassifyResult;
	return {
		workstream_id: parsed.workstream_id || null,
		new_workstream_name: parsed.new_workstream_name || null,
		is_work_message: Boolean(parsed.is_work_message),
	};
}

/** Reset cached client (for testing or key rotation). */
export function resetGeminiClient(): void {
	cachedClient = null;
}
