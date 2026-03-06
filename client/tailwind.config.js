/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  // Always-on dark mode via the 'dark' class on <html>
  darkMode: "class",

  theme: {
    extend: {

      // ── Color palette ──────────────────────────────
      colors: {
        // Primary teal/cyan accent
        cyan: {
          DEFAULT:  "#00ffc8",
          dim:      "rgba(0,255,200,0.45)",
          faint:    "rgba(0,255,200,0.12)",
          glow:     "rgba(0,255,200,0.25)",
        },
        // Secondary blue accent
        blue: {
          DEFAULT:  "#00c8ff",
          dim:      "rgba(0,200,255,0.45)",
          faint:    "rgba(0,200,255,0.12)",
        },
        // Background shades
        dark: {
          DEFAULT:  "#020c14",
          panel:    "rgba(2,12,20,0.85)",
          card:     "rgba(2,12,20,0.70)",
          overlay:  "rgba(2,12,20,0.95)",
        },
        // Semantic
        danger:  "#ff6060",
        warning: "#ffc832",
        success: "#00ffc8",

        // Legacy SO colors kept for any residual Tailwind class usage
        "so-orange":    "#f48024",
        "so-light":     "#eff0f1",
        "so-dark-gray": "#6a737c",
        "so-green":     "#5fba7d",
      },

      // ── Typography ─────────────────────────────────
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono:    ["Share Tech Mono", "monospace"],
        sans:    ["Share Tech Mono", "monospace"], // override Tailwind default
      },

      fontSize: {
        "2xs":  ["9px",  { lineHeight: "1.4", letterSpacing: "0.25em" }],
        "xs":   ["10px", { lineHeight: "1.5", letterSpacing: "0.15em" }],
        "sm":   ["12px", { lineHeight: "1.6", letterSpacing: "0.04em" }],
        "base": ["13px", { lineHeight: "1.7", letterSpacing: "0.03em" }],
        "lg":   ["16px", { lineHeight: "1.5", letterSpacing: "0.05em" }],
        "xl":   ["20px", { lineHeight: "1.3", letterSpacing: "0.08em" }],
        "2xl":  ["26px", { lineHeight: "1.2", letterSpacing: "0.08em" }],
        "3xl":  ["32px", { lineHeight: "1.1", letterSpacing: "0.1em"  }],
      },

      letterSpacing: {
        cyber:   "0.2em",
        widest2: "0.3em",
        label:   "0.28em",
      },

      // ── Spacing ────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "92": "23rem",
      },

      // ── Borders ────────────────────────────────────
      borderColor: {
        DEFAULT: "rgba(0,255,200,0.12)",
        hover:   "rgba(0,255,200,0.35)",
        active:  "rgba(0,255,200,0.6)",
      },

      borderRadius: {
        DEFAULT: "0px",  // Sharp corners throughout
        none:    "0px",
      },

      // ── Box shadows ────────────────────────────────
      boxShadow: {
        "cyan-sm":  "0 0 12px rgba(0,255,200,0.15)",
        "cyan-md":  "0 0 24px rgba(0,255,200,0.2)",
        "cyan-lg":  "0 0 40px rgba(0,255,200,0.25)",
        "cyan-xl":  "0 0 60px rgba(0,255,200,0.3)",
        "red-sm":   "0 0 12px rgba(255,80,80,0.18)",
        "panel":    "0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(0,255,200,0.06)",
        "inset-cyan": "inset 0 0 20px rgba(0,255,200,0.04)",
      },

      // ── Backdrop blur ──────────────────────────────
      backdropBlur: {
        xs:  "4px",
        sm:  "8px",
        md:  "16px",
        lg:  "24px",
        xl:  "32px",
      },

      // ── Animations ─────────────────────────────────
      animation: {
        // Entrance
        "fade-in":    "fadeIn 0.4s ease both",
        "fade-up":    "fadeUp 0.5s ease both",
        "fade-down":  "fadeDown 0.4s ease both",
        "scale-in":   "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both",

        // Looping
        "blink":      "blink 1.8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "shimmer":    "shimmer 1.4s ease-in-out infinite",
        "scan":       "scan 3s linear infinite",
        "hue-spin":   "hueSpin 8s linear infinite",
        "float-up":   "floatUp 8s linear infinite",

        // Interaction
        "glitch":     "glitch 4s steps(1) infinite",
        "slide-line": "slideLine 4s linear infinite",
      },

      keyframes: {
        // Entrance
        fadeIn:   { "0%": { opacity: "0" },                                "100%": { opacity: "1" } },
        fadeUp:   { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeDown: { "0%": { opacity: "0", transform: "translateY(-8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn:  { "0%": { opacity: "0", transform: "scale(0.96)" },      "100%": { opacity: "1", transform: "scale(1)" } },

        // Looping
        blink:      { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.2" } },
        pulseGlow:  { "0%,100%": { boxShadow: "0 0 8px rgba(0,255,200,0.3)"  }, "50%": { boxShadow: "0 0 24px rgba(0,255,200,0.7)" } },
        shimmer:    { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        scan:       { "0%": { top: "0%" }, "100%": { top: "100%" } },
        hueSpin:    { "from": { filter: "hue-rotate(0deg)" }, "to": { filter: "hue-rotate(360deg)" } },
        floatUp:    { "from": { transform: "translateY(100vh)", opacity: "0" }, "10%": { opacity: "1" }, "90%": { opacity: "0.5" }, "to": { transform: "translateY(-10vh)", opacity: "0" } },

        // Effects
        glitch: {
          "0%,88%,100%": { transform: "translate(0)",         opacity: "0" },
          "90%":          { transform: "translate(-3px,1px)",  opacity: "0.7" },
          "92%":          { transform: "translate(3px,-1px)",  opacity: "0" },
          "94%":          { transform: "translate(-2px,2px)",  opacity: "0.7" },
          "96%":          { transform: "translate(0)",         opacity: "0" },
        },
        slideLine: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },

      // ── Background images ──────────────────────────
      backgroundImage: {
        "grid-cyber":
          "linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px)",
        "gradient-cyan":
          "linear-gradient(90deg, #00ffc8, rgba(0,255,200,0.1), transparent)",
        "gradient-panel":
          "linear-gradient(135deg, rgba(0,255,200,0.12), rgba(0,150,255,0.07))",
        "shimmer-bar":
          "linear-gradient(90deg, rgba(0,255,200,0.04) 25%, rgba(0,255,200,0.08) 50%, rgba(0,255,200,0.04) 75%)",
      },

      backgroundSize: {
        "grid": "52px 52px",
        "shimmer": "200% 100%",
      },

      // ── Z-index scale ──────────────────────────────
      zIndex: {
        "1":   "1",
        "2":   "2",
        "5":   "5",
        "60":  "60",
        "70":  "70",
        "100": "100",
      },

      // ── Max widths ─────────────────────────────────
      maxWidth: {
        "content":      "1200px",
        "content-md":   "860px",
        "content-sm":   "640px",
        "card":         "440px",
      },

      // ── Transitions ────────────────────────────────
      transitionDuration: {
        "150": "150ms",
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
      },
    },
  },

  plugins: [],
};