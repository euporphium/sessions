'use client';

import { useSocketClient } from './socketContext';
import { useEffect, useState } from 'react';
import type { ChatMessage } from '@sessions/web-types';
import { cn } from '../../../../libs/ui/effects/src/lib/cn';

type ChatProps = {
  user: {
    id: string;
    name: string;
  };
};

export default function Chat({ user }: ChatProps) {
  const {
    socket,
    meta: { isConnected },
  } = useSocketClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function onChat(message: ChatMessage) {
      setMessages((prev) => [...prev, message]);
    }

    socket.on('chat', onChat);

    return () => {
      socket.off('chat', onChat);
    };
  }, [socket]);

  useEffect(() => {
    if (!isConnected) {
      setMessages([]);
    }
  }, [isConnected]);

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    // TODO always validation
    const message = formData.get('message') as string;
    const chatMessage = { sender: user, text: message };

    setMessages((prev) => [...prev, { sender: user, text: message }]);
    form.reset();

    socket.emit('chat', chatMessage);
  }

  return (
    <div className="grid gap-4 bg-gray-300 p-4">
      <ul className="flex flex-col gap-2">
        {messages.map((message, i) => (
          <li
            key={i}
            className={cn(
              'max-w-64 rounded p-2',
              message.sender.id === user.id
                ? 'self-end bg-gray-400'
                : 'self-start bg-blue-400',
            )}
          >
            <strong>{message.sender.name}</strong>: {message.text}
          </li>
        ))}
      </ul>
      {isConnected && (
        <form className="" onSubmit={submitHandler}>
          <div className="flex gap-2">
            <label htmlFor="message" className="sr-only">
              Chat Message
            </label>
            <input
              type="text"
              name="message"
              className="flex-grow rounded p-2"
            />

            <button type="submit" className="rounded bg-blue-400 p-2">
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
