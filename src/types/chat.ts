export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'NAVIGATE' | 'OPEN_CALCULATOR' | 'APPLY_FILTER' | 'PROMPT';
    payload: string;
  }[];
  sources?: {
    title: string;
    url?: string;
    publisher: string;
  }[];
}

export interface QuickPrompt {
  id: string;
  icon: string;
  title: string;
  prompt: string;
  category: 'IAQ' | 'ROUTINE' | 'COMMUNITY' | 'SCIENCE';
}
