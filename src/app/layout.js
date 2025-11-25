// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Parents Health Tracker',
  description: 'Diabetes & BP tracker for Mom and Dad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" min-h-screen">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
