/**
 * @file ChatPage.tsx
 * @description The main page for the chat module in the Lab portal.
 */

import React, { useState, useEffect } from "react";
import UserSearch from "./UserSearch";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { chatService, normalizeDate } from "./services/chatService";
import { useChat } from "../../hooks/useChat";
import { useLanguage } from "../../language/useLanguage";
import strings from "../../language";
import type { ChatUser, ChatThread } from "./types/chat.types";
import { MessageSquare, MoreVertical } from "lucide-react";

const ChatPage: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { language } = useLanguage();
  const t = strings[language];
  const [loading, setLoading] = useState(true);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const formatUnreadCount = (count: number) => {
    if (count <= 0) return null;
    return count > 99 ? "99+" : count;
  };

  // Use real-time chat hook
  const {
    messages,
    setMessages,
    sendMessage: sendSocketMessage,
    markAsRead,
    userStatuses,
  } = useChat(currentUserId);

  // Initialize
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "";
    if (storedUserId && storedUserId !== "undefined" && storedUserId !== "null") {
      setCurrentUserId(storedUserId);
    } else {
      console.warn("[ChatPage] No valid userId found in localStorage");
    }

    const loadThreads = async () => {
      setLoading(true);
      const fetchedThreads = await chatService.getThreads();
      setThreads(fetchedThreads);
      setLoading(false);
    };

    loadThreads();
  }, []);

  // Load history when selected user changes
  useEffect(() => {
    if (selectedUser) {
      const loadHistory = async () => {
        const history = await chatService.getMessages(selectedUser.id);

        setMessages((prev) => {
          const allMessages = [...history, ...prev];
          const uniqueMessages = Array.from(
            new Map(allMessages.map((m) => [m.id, m])).values(),
          );
          return uniqueMessages.sort(
            (a, b) =>
              normalizeDate(a.timestamp).getTime() -
              normalizeDate(b.timestamp).getTime(),
          );
        });

        markAsRead(selectedUser.id);
        setThreads((prev) =>
          prev.map((t) =>
            t.participant.id === selectedUser.id ? { ...t, unreadCount: 0 } : t,
          ),
        );
      };
      loadHistory();
    }
  }, [selectedUser, setMessages, markAsRead]);

  // Filter messages for current conversation
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.receiverId === selectedUser?.id) ||
      (msg.senderId === selectedUser?.id && msg.receiverId === currentUserId),
  );

  // Update threads sidebar when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const otherUserId = lastMsg.senderId === currentUserId ? lastMsg.receiverId : lastMsg.senderId;
      const isCurrentlySelected = selectedUser?.id === otherUserId;

      if (isCurrentlySelected && lastMsg.senderId === otherUserId) {
        markAsRead(otherUserId);
      }

      setThreads((prevThreads) => {
        const threadIndex = prevThreads.findIndex((t) => t.participant.id === otherUserId);

        if (threadIndex !== -1) {
          const updatedThreads = [...prevThreads];
          const newUnreadCount = lastMsg.receiverId === currentUserId && !isCurrentlySelected
            ? (updatedThreads[threadIndex].unreadCount || 0) + 1
            : isCurrentlySelected ? 0 : updatedThreads[threadIndex].unreadCount;

          updatedThreads[threadIndex] = {
            ...updatedThreads[threadIndex],
            lastMessage: lastMsg,
            unreadCount: newUnreadCount,
          };

          const [movedThread] = updatedThreads.splice(threadIndex, 1);
          return [movedThread, ...updatedThreads];
        } else if (!lastMsg.id.startsWith("temp-")) {
          const otherUser = lastMsg.senderId === currentUserId ? (lastMsg as any).receiver : (lastMsg as any).sender;

          if (!otherUser) {
            const fetchUpdatedThreads = async () => {
              const updated = await chatService.getThreads();
              setThreads(updated);
            };
            fetchUpdatedThreads();
            return prevThreads;
          }

          const newThread: ChatThread = {
            id: otherUserId,
            participant: {
              id: otherUser.id,
              firstName: otherUser.firstName,
              lastName: otherUser.lastName,
              email: otherUser.email,
            },
            lastMessage: lastMsg,
            unreadCount: lastMsg.receiverId === currentUserId && !isCurrentlySelected ? 1 : 0,
          };
          return [newThread, ...prevThreads];
        }
        return prevThreads;
      });
    }
  }, [messages, currentUserId, selectedUser?.id, markAsRead]);

  const handleSendMessage = async (content: string) => {
    if (!selectedUser) return;
    sendSocketMessage(selectedUser.id, content);
  };

  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user);
    if (!threads.find((t) => t.participant.id === user.id)) {
      setThreads([{ id: user.id, participant: user, unreadCount: 0 }, ...threads]);
    }
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-800">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">{t.chat.messagesHeader}</h1>
            <button
              onClick={() => searchInputRef.current?.focus()}
              className="p-2 bg-brand text-white rounded-full hover:bg-brand/80 transition-colors shadow-sm"
              title={t.chat.newMessage}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
          <UserSearch onSelectUser={handleSelectUser} inputRef={searchInputRef} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">{t.chat.loadingChats}</div>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>{t.chat.noConversations}</p>
              <p className="text-sm">{t.chat.searchToStart}</p>
            </div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedUser(thread.participant)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-brand/5 dark:hover:bg-brand/10 transition-colors border-b border-gray-100 dark:border-gray-800 text-left ${selectedUser?.id === thread.participant.id ? "bg-brand/10 dark:bg-brand/20" : ""}`}
              >
                <div className="h-12 w-12 rounded-full bg-brand text-white flex items-center justify-center font-bold relative">
                  {thread.participant.firstName[0]}{thread.participant.lastName[0]}
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-950 ${userStatuses[thread.participant.id] === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {thread.unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-gray-950 px-1 font-bold ${thread.unreadCount > 9 ? "min-w-[20px]" : "h-5 w-5"}`}>
                      {formatUnreadCount(thread.unreadCount)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold truncate">{thread.participant.firstName} {thread.participant.lastName}</p>
                    {thread.lastMessage && (
                      <p className="text-[10px] text-gray-400">
                        {normalizeDate(thread.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                  {thread.participant.email && (
                    <p className="text-xs text-gray-400 truncate">{thread.participant.email}</p>
                  )}
                  <p className="text-sm text-gray-500 truncate">{thread.lastMessage?.content || t.chat.startedConversation}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex justify-between items-center bg-white dark:bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                  {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                </div>
                <div>
                  <p className="font-bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                    <span className="ml-2 text-xs font-normal text-gray-400">{selectedUser.email}</span>
                  </p>
                  {userStatuses[selectedUser.id] === 'online' ? (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                      {t.chat.online}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Offline</p>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-brand/10 dark:hover:bg-brand/20 rounded-full transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <MessageList messages={filteredMessages} currentUserId={currentUserId} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.chat.yourMessages}</h2>
            <p>{t.chat.selectContact}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
