import { GoogleGenAI } from '@google/genai';

export interface AIExplanationResult {
  whyLearn: string;
  howItHelps: string;
  interviewQuestions: Array<{ question: string; answer: string }>;
  resumeBullets: string[];
  learningTips: string[];
  careerAdvice: string;
}

export class AIService {
  private static getGeminiInstance(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') return null;
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Generates Explainable AI guidance for a specific skill node using Google Gemini API
   */
  public static async explainSkill(
    skillName: string,
    skillCategory: string,
    targetCareer: string = 'Software Engineer'
  ): Promise<AIExplanationResult> {
    const ai = this.getGeminiInstance();

    if (ai) {
      try {
        const prompt = `You are NEXUS Career AI powered by Google Gemini. Explain why learning "${skillName}" (Category: ${skillCategory}) is vital for a candidate aiming to become a "${targetCareer}".
        Provide valid JSON output ONLY with this exact structure:
        {
          "whyLearn": "2 crisp sentences explaining high industry demand and core necessity",
          "howItHelps": "How this skill directly impacts day-to-day engineering and code quality",
          "interviewQuestions": [
            { "question": "Technical question 1", "answer": "Concise 2-sentence key answer point" },
            { "question": "Technical question 2", "answer": "Concise 2-sentence key answer point" }
          ],
          "resumeBullets": ["Action oriented resume bullet point 1", "Action oriented resume bullet point 2"],
          "learningTips": ["Hands-on tip 1", "Documentation tip 2"],
          "careerAdvice": "Inspirational 1-sentence career note"
        }`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const text = response.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as AIExplanationResult;
          }
        }
      } catch (err) {
        console.warn(`[AIService Warning] Gemini API call failed, using high-quality fallback generator:`, err);
      }
    }

    return this.generateFallbackExplanation(skillName, skillCategory, targetCareer);
  }

  /**
   * AI Career Advisor Chat Assistant powered by Google Gemini API
   */
  public static async generateAdvisorReply(
    userMessage: string,
    userProfile: { name: string; targetCareer: string; readinessPct: number; missingSkills: string[] }
  ): Promise<string> {
    const ai = this.getGeminiInstance();

    if (ai) {
      try {
        const prompt = `You are NEXUS AI Career Advisor powered by Google Gemini. User ${userProfile.name} is targeting "${userProfile.targetCareer}" with career readiness of ${userProfile.readinessPct}%. Key missing skills: ${userProfile.missingSkills.slice(0, 4).join(', ')}. User message: "${userMessage}". Keep response inspiring, technical, and under 120 words. Format with markdown bolding for key skills.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const reply = response.text;
        if (reply) return reply;
      } catch (err) {
        console.warn(`[AIService Chat Warning] Gemini API call failed:`, err);
      }
    }

    return `Hi ${userProfile.name}! Based on your Skill Knowledge Graph for **${userProfile.targetCareer}**, your readiness is calculated at **${userProfile.readinessPct}%**. To accelerate your trajectory, focus heavily on mastering **${userProfile.missingSkills[0] || 'core fundamentals'}** next. This will unlock ${userProfile.missingSkills.slice(1, 3).join(' and ')} in your personalized learning path!`;
  }

  private static generateFallbackExplanation(
    skillName: string,
    skillCategory: string,
    targetCareer: string
  ): AIExplanationResult {
    return {
      whyLearn: `${skillName} is an industry-standard technology in modern ${skillCategory.toLowerCase()} engineering. Tech leaders actively look for candidate proficiency in ${skillName} for ${targetCareer} positions.`,
      howItHelps: `Mastering ${skillName} enables you to engineer scalable, maintainable architectures, solve edge cases, and write clean production code with confidence.`,
      interviewQuestions: [
        {
          question: `What are the primary architectural benefits and trade-offs of using ${skillName}?`,
          answer: `${skillName} optimizes developer productivity, state predictability, and system throughput, requiring clear understanding of execution loops and memory efficiency.`
        },
        {
          question: `How do you debug performance bottlenecks when working with ${skillName} in production?`,
          answer: `By profiling call stacks, isolating bottleneck operations, minimizing unnecessary context switches, and writing targeted benchmarks.`
        }
      ],
      resumeBullets: [
        `Architected high-throughput services using ${skillName}, reducing API latency by 35% across production workloads.`,
        `Integrated ${skillName} into CI/CD pipelines, enforcing type safety, modular design, and robust test coverage.`
      ],
      learningTips: [
        `Build a hands-on end-to-end project rather than watching passive tutorials.`,
        `Read official documentation and explore open-source GitHub repositories to learn production idioms.`
      ],
      careerAdvice: `Focus on mastering foundational patterns in ${skillName} first—deep conceptual clarity will make future frameworks easy to learn!`
    };
  }
}
