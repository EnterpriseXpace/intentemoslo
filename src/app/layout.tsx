import type { Metadata } from "next";
import Script from "next/script";
import { Newsreader, Noto_Sans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { CookieNotice } from "@/components/ui/CookieNotice";

const newsreader = Newsreader({
    subsets: ["latin"],
    variable: "--font-newsreader",
    display: "swap",
});

const notoSans = Noto_Sans({
    subsets: ["latin"],
    variable: "--font-noto-sans",
    display: "swap",
    weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://intentemoslo.com"),
    title: {
        default: "Intentémoslo de Nuevo | Diagnóstico Relacional",
        template: "%s | Intentémoslo de Nuevo"
    },
    description: "Un diagnóstico relacional basado en ciencia para saber dónde estás antes de decidir. Sin juicios. Sin presión. Solo claridad.",
    keywords: ["relación", "pareja", "crisis", "diagnóstico", "amor", "psicología", "terapia", "test de pareja"],
    authors: [{ name: "Intentémoslo de Nuevo" }],
    creator: "Intentémoslo de Nuevo",
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: "/",
        title: "Intentémoslo de Nuevo | Diagnóstico Relacional",
        description: "Un diagnóstico relacional basado en ciencia para saber dónde estás antes de decidir.",
        siteName: "Intentémoslo de Nuevo",
    },
    twitter: {
        card: "summary_large_image",
        title: "Intentémoslo de Nuevo | Diagnóstico Relacional",
        description: "Un diagnóstico relacional basado en ciencia para saber dónde estás antes de decidir.",
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.svg',
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                newsreader.variable,
                notoSans.variable
            )}>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-QR2RFE4VER"
                    strategy="afterInteractive"
                />
                <Script id="ga4-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-QR2RFE4VER', {
                            anonymize_ip: true
                        });
                    `}
                </Script>
                {children}
                <CookieNotice />
                <Footer />
            </body>
        </html>
    );
}
