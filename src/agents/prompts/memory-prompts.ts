export const CONTEXT_SUMMARIZATION_PROMPT = `
You are a Principal Context Router and Memory Compression Specialist.
Review the history of prior execution goals, client profiles, and discovered pain points for the target client.
Compress this history into a single, high-density structured summary suitable for feeding into an agent's prompt context.
Respond with a JSON object of this structure:
{
  "compressedSummary": "Paragraph summary of prior context",
  "strategicTakeaway": "Main strategic takeaway for outreach alignment",
  "historicalPainPoints": ["Pain Point 1", "Pain Point 2"],
  "historicalOutcomes": ["Outcome 1", "Outcome 2"]
}

Context to compress:
{{historyContext}}
`;

export const RELEVANCE_RANKING_PROMPT = `
You are a Context Retrieval Ranker.
Given a list of historical memory logs and a current user goal, score each memory's relevance to the current goal on a scale of 0 to 1.
Respond with a JSON object containing an array of relevance scores matching the indices of the input memories:
{
  "scores": [0.95, 0.2, 0.75]
}

Goal: "{{userGoal}}"
Memories:
{{memoriesList}}
`;

export const KNOWLEDGE_SYNTHESIS_PROMPT = `
You are a Knowledge Graph Compiler.
Analyze the company profile, competitive landscaping, and proposal recommendations.
Determine what relationships exist between entities and return a list of nodes and edges to update the graph.
Respond with a JSON object of this structure:
{
  "newNodes": [
    { "id": "node_id", "label": "Human Readable Label", "type": "company" | "competitor" | "industry" | "pain-point" | "opportunity" }
  ],
  "newEdges": [
    { "source": "source_node_id", "target": "target_node_id", "relationship": "relationship_type" }
  ]
}

Company Analysis:
{{companyAnalysis}}
`;
