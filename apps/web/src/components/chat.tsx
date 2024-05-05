'use client';

import { useSocket } from './socketContext';
import { useEffect, useState } from 'react';

export default function Chat() {
  const {
    socket,
    meta: { isConnected },
  } = useSocket();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    [],
  );

  useEffect(() => {
    function onChat(message: { sender: string; text: string }) {
      setMessages((prev) => [...prev, message]);
    }

    socket.on('chat', onChat);

    return () => {
      socket.off('chat', onChat);
    };
  }, []);

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
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    const chatMessage = { sender: name, text: message };

    setMessages((prev) => [...prev, { sender: 'You', text: message }]);

    socket.emit('chat', chatMessage);
  }

  return (
    <div className="grid max-w-lg gap-4 bg-gray-300 p-4">
      <ul className="flex flex-col gap-2">
        {messages.map((message, i) => (
          <li
            key={i}
            className={
              message.sender === 'You'
                ? 'self-end bg-blue-400 p-2'
                : 'self-start bg-green-400 p-2'
            }
          >
            <strong>{message.sender}</strong>: {message.text}
          </li>
        ))}
      </ul>
      {isConnected && (
        <form className="" onSubmit={submitHandler}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" />

          <label htmlFor="message">Message</label>
          <input type="text" name="message" />

          <button type="submit" className="bg-blue-200 p-2">
            Send
          </button>
        </form>
      )}
    </div>
  );
}
