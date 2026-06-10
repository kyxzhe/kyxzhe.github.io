import { contactInfo } from "@/lib/constants/contact";
import {
  aboutIntro,
  collaborationPitch,
  funFacts,
  researchFocus,
} from "@/lib/constants/about";
import { heroContent } from "@/lib/constants/siteContent";
import { socials } from "@/lib/constants/socials";
import { siteMetadata } from "@/lib/seo/config";

/**
 * Console Utility
 * Displays developer credits and ASCII art in browser console
 */

declare global {
  interface Window {
    kevinZheng?: {
      info: () => void;
      links: () => void;
      ascii: () => void;
      heart: () => void;
      collab: () => void;
      notes: () => void;
      ack: () => void;
    };
  }
}

const heroTagline = `${heroContent.line2Prefix} ${heroContent.line2Emphasis}${heroContent.line2Suffix} ${heroContent.line3}`
  .replace(/\s+/g, " ")
  .trim();

const missionMessage =
  "My research looks at how information spreads online and how to keep machine learning models a little more robust when faced with the messiness of the real world.";

const aboutSnippet = aboutIntro.split("\n\n")[0];

const socialLabelMap: Record<keyof typeof socials, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  googleScholar: "Google Scholar",
  orcid: "ORCID",
};

const socialEntries = (Object.keys(socials) as Array<keyof typeof socials>).map(
  (key) => ({
    label: socialLabelMap[key],
    url: socials[key],
  })
);

const consoleNotes = [
  "This studio console waits ~1s to pop open with ASCII vibes so the page can hydrate first.",
  "Devtools detection pulses every 500ms to spot the extra-sized viewport explorers.",
  "The hero tagline is stitched right out of the landing copy, so console fans stay aligned.",
];

let consoleInitialized = false;
let devToolsIntervalId: ReturnType<typeof setInterval> | undefined;

export const consoleUtil = {
  asciiArt: `
██╗  ██╗███████╗██╗   ██╗██╗███╗   ██╗     
██║ ██╔╝██╔════╝██║   ██║██║████╗  ██║     
█████╔╝ █████╗  ██║   ██║██║██╔██╗ ██║     
██╔═██╗ ██╔══╝  ╚██╗ ██╔╝██║██║╚██╗██║     
██║  ██╗███████╗ ╚████╔╝ ██║██║ ╚████║     
╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝     
                                           
███████╗██╗  ██╗███████╗███╗   ██╗ ██████╗ 
╚══███╔╝██║  ██║██╔════╝████╗  ██║██╔════╝ 
  ███╔╝ ███████║█████╗  ██╔██╗ ██║██║  ███╗
 ███╔╝  ██╔══██║██╔══╝  ██║╚██╗██║██║   ██║
███████╗██║  ██║███████╗██║ ╚████║╚██████╔╝
╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝
`,
  developerInfo: {
    ...contactInfo,
    website: siteMetadata.baseUrl,
    message: missionMessage,
  },
  researchHighlights: researchFocus,
  funFacts,
  collaborationPitch,
  socialEntries,
  heroTagline,
  aboutSnippet,
  consoleNotes,
  styles: {
    title: "color: #ff6b6b; font-size: 16px; font-weight: bold;",
    ascii: "color: #4ecdc4; font-family: monospace; font-size: 10px; line-height: 1;",
    info: "color: #45b7d1; font-size: 14px;",
    link: "color: #96ceb4; font-size: 12px; text-decoration: underline;",
    message: "color: #feca57; font-size: 12px; font-style: italic;",
    heart: "color: #ff6b6b; font-size: 14px;",
  },

  display() {
    console.log(`%c${this.asciiArt}`, this.styles.ascii);

    console.log(`%c${heroContent.line1}`, this.styles.title);
    console.log(`%c${this.heroTagline}`, this.styles.title);
    console.log(`%c${this.aboutSnippet}`, this.styles.info);
    console.log(`%c${this.developerInfo.message}`, this.styles.message);

    console.log(`%c\n📬 Contact & Availability`, this.styles.info);
    console.log(`%c• Email: ${this.developerInfo.email}`, this.styles.link);
    console.log(`%c• Location: ${this.developerInfo.location}`, this.styles.info);
    console.log(`%c• Availability: ${this.developerInfo.availability}`, this.styles.message);
    console.log(`%c• Website: ${this.developerInfo.website}`, this.styles.link);

    console.log(`%c\n🔗 Connect`, this.styles.info);
    this.socialEntries.forEach((entry) =>
      console.log(`%c• ${entry.label}: ${entry.url}`, this.styles.link)
    );

    console.log(`%c\n📌 Research Highlights`, this.styles.info);
    this.researchHighlights.forEach((line) =>
      console.log(`%c${line}`, this.styles.info)
    );

    console.log(`%c\n🎲 Fun Facts`, this.styles.message);
    this.funFacts.forEach((line) =>
      console.log(`%c${line}`, this.styles.message)
    );

    console.log(`%c\n🎧 Console whispers`, this.styles.info);
    this.consoleNotes.forEach((note) =>
      console.log(`%c• ${note}`, this.styles.message)
    );

    console.log(`%c\n🤝 Collaborate`, this.styles.title);
    console.log(`%c${this.collaborationPitch}`, this.styles.info);

    console.log(`%c\n🎮 Try these commands:`, this.styles.info);
    console.log(`%c• kevinZheng.info() — Quick hero + contact snapshot`, this.styles.info);
    console.log(`%c• kevinZheng.links() — Website & social links`, this.styles.info);
    console.log(`%c• kevinZheng.ascii() — Repeat the artwork`, this.styles.info);
    console.log(`%c• kevinZheng.collab() — Collaboration pitch`, this.styles.info);
    console.log(`%c• kevinZheng.notes() — Console whispers`, this.styles.info);
    console.log(`%c• kevinZheng.ack() — Acknowledgements`, this.styles.info);
    console.log(`%c• kevinZheng.heart() — Small morale boost`, this.styles.info);
  },

  setupCommands() {
    window.kevinZheng = {
      info: () => {
        console.log(`%c${heroContent.line1}`, this.styles.title);
        console.log(`%c${this.heroTagline}`, this.styles.title);
        console.log(`%c${this.aboutSnippet}`, this.styles.info);
        console.log(`%c${this.developerInfo.message}`, this.styles.message);
        console.log(`%c\n📍 ${this.developerInfo.location} · ${this.developerInfo.availability}`, this.styles.info);
        console.log(`%c• Email: ${this.developerInfo.email}`, this.styles.link);
        console.log(`%c• Website: ${this.developerInfo.website}`, this.styles.link);
      },

      links: () => {
        console.log(`%c🔗 Website & Socials`, this.styles.title);
        console.log(`%c• Website: ${this.developerInfo.website}`, this.styles.link);
        console.log(`%c• Email: ${this.developerInfo.email}`, this.styles.link);
        this.socialEntries.forEach((entry) =>
          console.log(`%c• ${entry.label}: ${entry.url}`, this.styles.link)
        );
      },

      ascii: () => {
        console.log(`%c${this.asciiArt}`, this.styles.ascii);
      },

      heart: () => {
        console.log(`%c❤️ Fueled by coffee, proofs, and midnight experiments!`, this.styles.heart);
      },

      collab: () => {
        console.log(`%c🤝 Collaborate`, this.styles.title);
        console.log(`%c${this.collaborationPitch}`, this.styles.info);
        console.log(`%cSay hi: ${this.developerInfo.email}`, this.styles.link);
      },
      notes: () => {
        console.log(`%c🎧 Console whispers`, this.styles.info);
        this.consoleNotes.forEach((note) =>
          console.log(`%c• ${note}`, this.styles.message)
        );
      },
      ack: () => {
        console.log(`%c✨ Acknowledgements`, this.styles.title);
        console.log(`%cSpecial thanks to Yilin Ye for guidance on the site’s visual and interaction design.`, this.styles.info);
      },
    };
  },

  init() {
    if (consoleInitialized) return;
    consoleInitialized = true;

    this.setupCommands();
    this.display();
    this.detectDevTools();
  },

  detectDevTools() {
    if (devToolsIntervalId) return;

    const devtools = { open: false };

    devToolsIntervalId = setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > 200 ||
        window.outerWidth - window.innerWidth > 200
      ) {
        if (!devtools.open) {
          devtools.open = true;
          console.log(`%c🔍 Welcome to the developer console!`, this.styles.title);
          console.log(
            `%c💡 Tip: Try typing 'kevinZheng.info()' or 'kevinZheng.links()' for a quick tour`,
            this.styles.message
          );
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  },
};
