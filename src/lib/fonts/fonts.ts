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

export const westernBangBang = localFont({
  src: "../../../public/fonts/western-bang-bang.ttf",
  variable: "--font-western-bang-bang",
});

export const specialElite = localFont({
  src: "../../../public/fonts/special-elite.ttf",
  variable: "--font-special-elite",
});

export const lifeIsSoWonderful = localFont({
  src: "../../../public/fonts/life-is-so-wonderful.ttf",
  variable: "--font-life-is-so-wonderful",
});

export const cutTheCrap = localFont({
  src: "../../../public/fonts/cut-the-crap.ttf",
  variable: "--font-cut-the-crap",
});
