export const dailyPrompts: string[] = [
  "What are you most grateful for today?",
  "Describe a small act of kindness you witnessed or performed.",
  "What is one thing you learned today, big or small?",
  "How did you take care of yourself today?",
  "What challenge did you face, and how did you approach it?",
  "Reflect on a moment that made you smile today.",
  "What are you looking forward to tomorrow?",
  "If you could describe today in one word, what would it be and why?",
  "What progress did you make towards a goal today?",
  "What is something that is currently weighing on your mind?",
  "Describe a sound, smell, or sight that caught your attention today.",
  "What made you feel strong today?",
  "What is one thing you would like to let go of?",
  "How can you make tomorrow even better than today?",
  "What creative energy did you explore today?",
  "Who inspired you today, and how?",
  "What does 'peace' mean to you in this moment?",
  "If today was a chapter in your life's book, what would its title be?",
  "What beauty did you notice in the ordinary today?",
  "What's one positive affirmation you can tell yourself right now?"
];

export function getDailyPrompt(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dailyPrompts[dayOfYear % dailyPrompts.length];
}
