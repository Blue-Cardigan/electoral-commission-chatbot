import { OpenAI } from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.ASSISTANT_ID;

export async function POST() {
  if (!assistantId) {
    return NextResponse.json(
      { error: 'Assistant ID is not configured' },
      { status: 500 }
    );
  }

  try {
    const thread = await openai.beta.threads.create();
    return NextResponse.json({ 
      threadId: thread.id,
      assistantId: assistantId 
    });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the thread.' },
      { status: 500 }
    );
  }
} 