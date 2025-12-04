export interface StoryboardFrame {
  id: number;
  shot_type: string;
  description: string;
  visual_prompt: string;
  voiceover: string;
  time: string;
  imageData?: string;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export interface ScriptResponse {
  storyboard: {
    frame_number: number;
    shot_type: string;
    action_description: string;
    visual_generation_prompt: string;
    voiceover_script: string;
    estimated_duration: string;
  }[];
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';