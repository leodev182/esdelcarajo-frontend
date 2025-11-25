import localFont from "next/font/local";

export const zuumeRough = localFont({
  src: [
    {
      path: "../../../public/fonts/fontspring-demo-zuumerough-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fontspring-demo-zuumerough-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/fonts/fontspring-demo-zuumerough-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fontspring-demo-zuumerough-bolditalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-zuume-rough",
});
