// import { Card } from '@/components/ui'
// import { formatDate } from '@/lib/utils'
// import type { ChatSession } from '../types'

// interface ChatListProps {
//   sessions: ChatSession[]
//   onSelectSession: (session: ChatSession) => void
//   selectedSessionId?: string
// }

// export const ChatList = ({ sessions, onSelectSession, selectedSessionId }: ChatListProps) => {
//   return (
//     <div className="space-y-2">
//       {sessions.map(session => (
//         <Card
//           key={session.id}
//           className={`cursor-pointer transition-colors
//             ${selectedSessionId === session.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
//           onClick={() => onSelectSession(session)}
//         >
//           <h3 className="font-medium">{session.title}</h3>
//           {session.lastMessage && (
//             <p className="text-sm text-gray-500 truncate">{session.lastMessage}</p>
//           )}
//           <p className="text-xs text-gray-400">{formatDate(session.updatedAt)}</p>
//         </Card>
//       ))}
//     </div>
//   )
// }