import { SocketContextProvider } from '../components/socketContext';
import './global.css';

export const metadata = {
  title: 'Welcome to apps/web',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SocketContextProvider>{children}</SocketContextProvider>
      </body>
    </html>
  );
}