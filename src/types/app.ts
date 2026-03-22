export interface ChildConfig {
  id: string;
  name: string;
  token: string;
}

export interface AppConfig {
  canvasDomain: string;
  children: ChildConfig[];
  mcpHost: string;
  mcpPort: number;
  anthropicApiKey: string;
  appPin?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIInsight {
  type: "warning" | "info" | "success";
  title: string;
  description: string;
}

export interface CatchUpSummary {
  needsAttention: string[];
  upcomingDeadlines: string[];
  goodNews: string[];
  fullSummary: string;
}
