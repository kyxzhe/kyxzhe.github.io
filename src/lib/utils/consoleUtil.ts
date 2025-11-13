/**
 * Console Utility
 * Displays developer credits and ASCII art in browser console
 */

// Extend Window interface for console helper
declare global {
  interface Window {
    kevinZheng?: {
      info: () => void;
      links: () => void;
      ascii: () => void;
      heart: () => void;
      collab: () => void;
    };
  }
}

export const consoleUtil = {
  // ASCII Art for Kevin Zheng
  asciiArt: `
 _  __                 _             ______
| |/ /___  ___ _   _  | | _____ _ __|___  /___  ___  _ __
| ' // _ \\/ __| | | | | |/ / _ \\ '__| / // _ \\/ _ \\| '_ \\
| . \\  __/\\__ \\ |_| | |   <  __/ |   / /|  __/ (_) | | | |
|_|\\_\\___||___/\\__,_| |_|\\_\\___|_|  /_/  \\___|\\___/|_| |_|
`,

  // Developer information
  developerInfo: {
    name: "Yuxiang (Kevin) Zheng",
    github: "https://github.com/kyxzhe",
    website: "https://kyxzhe.github.io",
    email: "kevin.zheng@student.uts.edu.au",
    message: "Mapping information diffusion and building robust ML for social platforms — say hi! 🚀"
  },
  researchHighlights: [
    "🧠 PhD @ UTS Behavioural Data Science Lab with Marian-Andrei Rizoiu.",
    "🌐 Studying how narratives travel across X, Reddit, and YouTube.",
    "🧪 Recasting noisy labels as useful signals for robust learning.",
    "🎓 Designing messy-data labs for DS + ML students."
  ],
  funFacts: [
    "📷 Film photography addict—still scans negatives at 2 a.m.",
    "☕ Will cross a city for a recommendation-worthy flat white.",
    "🏹 Balances research sprints with archery, diving daydreams, and gym resets."
  ],

  // Console styles
  styles: {
    title: "color: #ff6b6b; font-size: 16px; font-weight: bold;",
    ascii: "color: #4ecdc4; font-family: monospace; font-size: 10px; line-height: 1;",
    info: "color: #45b7d1; font-size: 14px;",
    link: "color: #96ceb4; font-size: 12px; text-decoration: underline;",
    message: "color: #feca57; font-size: 12px; font-style: italic;",
    heart: "color: #ff6b6b; font-size: 14px;"
  },

  // Display the easter egg
  display() {
    // Clear console first (optional)
    console.clear();

    // Display ASCII art
    console.log(`%c${this.asciiArt}`, this.styles.ascii);
    
    // Display title
    console.log(`%c🧠 Built with curiosity by ${this.developerInfo.name}`, this.styles.title);
    // taking a peek huh?
    console.log(`%c👀👀 Taking a peek huh? 👀👀 checkout links below!`, this.styles.title);
    // Display links
    console.log(`%c🔗 GitHub: ${this.developerInfo.github}`, this.styles.link);
    console.log(`%c🌐 Website: ${this.developerInfo.website}`, this.styles.link);
    console.log(`%c📧 Email: ${this.developerInfo.email}`, this.styles.link);
    
    console.log(`%c\n📌 Research Highlights`, this.styles.info);
    this.researchHighlights.forEach((line) =>
      console.log(`%c${line}`, this.styles.info)
    );

    console.log(`%c\n🎲 Fun Facts`, this.styles.message);
    this.funFacts.forEach((line) =>
      console.log(`%c${line}`, this.styles.message)
    );

    // Display message
    console.log(`%c💬 ${this.developerInfo.message}`, this.styles.message);
    
    // Add interactive commands
    console.log(`%c\n🎮 Try these commands:`, this.styles.info);
    console.log(`%c• kevinZheng.info() - Show developer info`, this.styles.info);
    console.log(`%c• kevinZheng.links() - Show all links`, this.styles.info);
    console.log(`%c• kevinZheng.ascii() - Show ASCII art again`, this.styles.info);
    console.log(`%c• kevinZheng.collab() - Ways we can work together`, this.styles.info);
  },

  // Interactive commands
  setupCommands() {
    // Create global helper object
    window.kevinZheng = {
      info: () => {
        console.log(`%c👨‍💻 Developer Information`, this.styles.title);
        console.log(`%cName: ${this.developerInfo.name}`, this.styles.info);
        console.log(`%cGitHub: ${this.developerInfo.github}`, this.styles.link);
        console.log(`%cWebsite: ${this.developerInfo.website}`, this.styles.link);
        console.log(`%cEmail: ${this.developerInfo.email}`, this.styles.link);
      },
      
      links: () => {
        console.log(`%c🔗 All Links`, this.styles.title);
        Object.entries(this.developerInfo)
          .filter(([key]) => ['github', 'website', 'email'].includes(key))
          .forEach(([key, value]) => {
            console.log(`%c${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, this.styles.link);
          });
      },
      
      ascii: () => {
        console.log(`%c${this.asciiArt}`, this.styles.ascii);
      },
      
      heart: () => {
        console.log(`%c❤️ Fueled by coffee, proofs, and midnight experiments!`, this.styles.heart);
      },

      collab: () => {
        console.log(`%c🤝 Collaboration`, this.styles.title);
        console.log(`%cAvailable for:`, this.styles.info);
        console.log(`%c• Research partnerships on robust & trustworthy ML`, this.styles.info);
        console.log(`%c• Technical consulting for data-centric AI teams`, this.styles.info);
        console.log(`%c• Guest lectures / workshops on advanced ML`, this.styles.info);
        console.log(`%cSay hi: ${this.developerInfo.email}`, this.styles.link);
      }
    };
  },

  // Initialize the easter egg
  init() {
    // Display immediately
    this.display();
    
    // Setup interactive commands
    this.setupCommands();
    
    // Add detection for dev tools opening (optional)
    this.detectDevTools();
  },

  // Detect when dev tools are opened
  detectDevTools() {
    const devtools = { open: false };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          console.log(`%c🔍 Welcome to the developer console!`, this.styles.title);
          console.log(`%c💡 Tip: Try typing 'kevinZheng.info()' for more info!`, this.styles.message);
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
};

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Delay to ensure page is loaded
  setTimeout(() => {
    consoleUtil.init();
  }, 1000);
}
