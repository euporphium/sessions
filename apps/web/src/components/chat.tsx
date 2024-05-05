'use client';

import { useSocket } from './socketContext';
import { useEffect, useState } from 'react';

export default function Chat() {
  const { socket } = useSocket();
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
    <div>
      {messages.map((message, index) => (
        <div
          key={index}
          className={message.sender === 'You' ? 'bg-blue-400' : 'bg-green-400'}
        >
          <strong>{message.sender}</strong>: {message.text}
        </div>
      ))}
      <form className="" onSubmit={submitHandler}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" />

        <label htmlFor="message">Message</label>
        <input type="text" name="message" />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}
