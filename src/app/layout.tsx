import "~/styles/globals.css";

import { type Metadata } from "next";
import { JetBrains_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";

import { ThemeProvider } from "~/components/providers/ThemeProvider";
import { LangProvider } from "~/components/providers/LangProvider";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Portapic — The platform built for photographers",
  description:
    "Build stunning portfolios, sell your work, manage cloud storage, and deliver galleries to clients — all in one place.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakartaSans.variable} ${lora.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <LangProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LangProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
