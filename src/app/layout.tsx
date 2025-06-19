import { rubik } from "./_styles/fonts";
import "./_styles/globals.css"; 
import { AlertProvider } from "@context";

export const metadata = {
  title: "Zoe test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased`}>
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}
