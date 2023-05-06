"use client";

import "./globals.css";
import { Montserrat } from "next/font/google";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";
import { Authenticator } from "@aws-amplify/ui-react";
import SubLayout from "./SubLayout";

Amplify.configure({ ...awsExports, ssr: true });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Ubice Rekognition",
  description: "Reconocimiento de fotos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={montserrat.className}>
        <Authenticator hideSignUp={true}>
          {({ signOut, user }) => {
            return (
              <SubLayout signOut={signOut} user={user}>
                {children}
              </SubLayout>
            );
          }}
        </Authenticator>
      </body>
    </html>
  );
}
