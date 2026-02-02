/**
 * Chat API service client for communicating with backend.
 */

import { ChatRequest, ChatResponse } from '@/types/chat';

// Use Next.js API proxy instead of calling FastAPI directly
// This allows server-side authentication handling
// Use empty string for relative URLs to work in both local and deployed environments
const API_BASE_URL = '';

class ChatService {
  async sendMessage(
    userId: string,
    message: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    const requestBody: ChatRequest = {
      message,
      ...(conversationId && { conversation_id: conversationId }),
    };

    // Call Next.js API proxy which handles authentication server-side
    // Using relative URL so it works on both localhost and deployed environments
    const response = await fetch(`/api/chat/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for Better Auth session
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      } else if (response.status === 404) {
        throw new Error('Conversation not found.');
      } else {
        throw new Error('Failed to send message. Please try again.');
      }
    }

    const data: ChatResponse = await response.json();
    return data;
  }
}

// Export singleton instance
export const chatService = new ChatService();
