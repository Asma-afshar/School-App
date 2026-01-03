
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateStudentReport = async (studentName: string, studentData: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a brief, encouraging academic performance summary for a student named ${studentName}. 
      Context: ${studentData}. 
      Focus on strengths and areas for improvement. Format with bullet points.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI report. Please check your connection or API key.";
  }
};

export const generateSyllabus = async (courseTitle: string, description: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional and structured course syllabus for "${courseTitle}".
      Course Description: ${description}.
      Include: 
      1. Course Objectives
      2. Learning Outcomes
      3. A weekly breakdown (4 weeks)
      Format using clear headings and bullet points.`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Syllabus Generation Error:", error);
    return "Failed to generate syllabus. Please try again later.";
  }
};

export const chatWithAssistant = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are an expert school administrative assistant and educational consultant. Help the user with school management tasks, lesson planning, and student behavioral advice.',
    }
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The assistant is currently unavailable.";
  }
};
