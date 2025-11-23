import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export { poppins };
