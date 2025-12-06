export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  imageData: string | null;
}

export interface PromptConfig {
  prompt: string;
}