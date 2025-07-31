export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout'
    },
    CHAT: {
      SESSIONS: '/chat/sessions',
      MESSAGES: '/chat/messages'
    },
    DOCUMENTS: {
      UPLOAD: '/documents/upload',
      LIST: '/documents'
    }
  } as const