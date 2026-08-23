import "@/styles/marketing.css";

export const metadata = {
  title: "WE WERE HERE — The Sibling Archive",
  description: "A private little place for the memories only siblings understand."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
