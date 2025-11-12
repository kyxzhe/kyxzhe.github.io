/**
 * Console Utility
 * Displays developer credits and ASCII art in browser console
 */

// Extend Window interface for wafastarz object
declare global {
  interface Window {
    wafastarz?: {
      info: () => void;
      links: () => void;
      ascii: () => void;
      heart: () => void;
    };
  }
}

export const consoleUtil = {
  // ASCII Art for Wafastarz
  asciiArt: `
██╗    ██╗ █████╗ ███████╗ █████╗ ███████╗████████╗ █████╗ ██████╗ ███████╗
██║    ██║██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══███╔╝
██║ █╗ ██║███████║█████╗  ███████║███████╗   ██║   ███████║██████╔╝  ███╔╝ 
██║███╗██║██╔══██║██╔══╝  ██╔══██║╚════██║   ██║   ██╔══██║██╔══██╗ ███╔╝  
╚███╔███╔╝██║  ██║██║     ██║  ██║███████║   ██║   ██║  ██║██║  ██║███████╗
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
`,

  // Developer information
  developerInfo: {
    name: "Wafastarz (Muhammad Khoirul Wafa)",
    github: "https://github.com/mkhoirulwafa18",
    website: "https://wafastarz.site",
    email: "wafastarzteam@gmail.com",
    message: "Thanks for checking out the code! 🚀"
  },

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
    console.log(`%c🎨 Made with ❤️ by ${this.developerInfo.name}`, this.styles.title);
    // taking a peek huh?
    console.log(`%c👀👀 Taking a peek huh? 👀👀 checkout links below!`, this.styles.title);
    // Display links
    console.log(`%c🔗 GitHub: ${this.developerInfo.github}`, this.styles.link);
    console.log(`%c🌐 Website: ${this.developerInfo.website}`, this.styles.link);
    console.log(`%c📧 Email: ${this.developerInfo.email}`, this.styles.link);
    
    // Display message
    console.log(`%c💬 ${this.developerInfo.message}`, this.styles.message);
    
    // Add interactive commands
    console.log(`%c\n🎮 Try these commands:`, this.styles.info);
    console.log(`%c• wafastarz.info() - Show developer info`, this.styles.info);
    console.log(`%c• wafastarz.links() - Show all links`, this.styles.info);
    console.log(`%c• wafastarz.ascii() - Show ASCII art again`, this.styles.info);
  },

  // Interactive commands
  setupCommands() {
    // Create global wafastarz object
    window.wafastarz = {
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
        console.log(`%c❤️ Made with love and lots of coffee! ☕`, this.styles.heart);
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
          console.log(`%c💡 Tip: Try typing 'wafastarz.info()' for more info!`, this.styles.message);
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