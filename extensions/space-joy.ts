/**
 * Space Joy Extension
 *
 * Customizes the "Working..." indicator with terms from spacecraft
 * engine development. Each streaming session picks a random word
 * from the profession (propulsion engineer jargon) and displays it
 * as the animated indicator.
 *
 * Words span the full lifecycle of engine development:
 * design, testing, operation, and maintenance.
 *
 * Placement: ~/.pi/agent/extensions/space-joy.ts (auto-discovered)
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

/**
 * Terms drawn across the spacecraft engine development lifecycle.
 * Covers design, propulsion cycles, testing, and flight operations.
 */
const PROPULSION_WORDS = [
	// Combustion & cycle terminology
	"gasifying",
	"preburning",
	"igniting",
	"chambering",
	"injecting",
	"atomizing",
	"combusting",

	// Fluids & feed systems
	"turbopumping",
	"pressurizing",
	"regenerating",
	"cooling",
	"slurping",
	"priming",
	"bleeding",
	"venting",

	// Nozzle & thrust
	"expanding",
	"throttling",
	"vectored",
	"chugging",
	"spooling",
	"gimbaling",
	"bell-flaring",

	// Staging & operations
	"staging",
	"separating",
	"coasting",
	"restarting",
	"shutdowning",

	// Testing & development
	"hot-firing",
	"stand-igniting",
	"cold-flowing",
	"static-firing",
	"cycle-firing",

	// Materials & structures
	"ablating",
	"sintering",
	"corroding",
	"creeping",
	"fatiguing",

	// Thruster types
	"ionizing",
	"magnetizing",
	"resisto-jetting",
	"solar-thermalizing",
	"nuclear-thermalizing",

	// Performance & analysis
	"specific-impulsing",
	"delta-v-ing",
	"c-star-ing",
	"c-f-ing",
	"mixing",

	// Space operations
	"orbiting",
	"hohmanning",
	"bi-ellipticing",
	"gravity-assisting",
	"pulsing",
] as const;

/** Spinner glyphs for the working indicator animation. */
const SPINNERS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/** ANSI color codes — warm rocket-plume palette. */
const FLAME_COLORS = [
	"\x1b[38;2;255;179;186m", // rose
	"\x1b[38;2;255;223;186m", // peach
	"\x1b[38;2;255;255;186m", // amber
	"\x1b[38;2;186;255;201m", // sky
	"\x1b[38;2;186;225;255m", // periwinkle
	"\x1b[38;2;218;186;255m", // lavender
];
const RESET = "\x1b[39m";

/** Pick a random element from an array. */
function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Colorize `text` with `ansi`. */
function colorize(text: string, ansi: string): string {
	return `${ansi}${text}${RESET}`;
}

/** Build the animated indicator frames for one word. */
function buildFrames(word: string) {
	const label = `${word}…`;
	return SPINNERS.map((glyph, i) => {
		const color = FLAME_COLORS[i % FLAME_COLORS.length]!;
		return `${colorize(glyph, color)} ${label}`;
	});
}

export default function (pi: ExtensionAPI) {
	let currentWord: string | null = null;

	const applyWord = (ctx: ExtensionContext) => {
		const word = pick(PROPULSION_WORDS);
		currentWord = word;
		ctx.ui.setWorkingMessage("");
		ctx.ui.setWorkingIndicator({
			frames: buildFrames(word),
			intervalMs: 90,
		});
	};

	/** Re-roll the word when a new agent session starts. */
	pi.on("session_start", async (_event, ctx) => {
		applyWord(ctx);
	});

	/**
	 * Also swap the word at each turn so consecutive tool-calling
	 * turns feel fresh.
	 */
	pi.on("turn_start", async (_event, ctx) => {
		applyWord(ctx);
	});

	pi.registerCommand("space-joy", {
		description: "Show the current space-joy word or roll a new one.",
		handler: async (_args, ctx) => {
			const word = pick(PROPULSION_WORDS);
			ctx.ui.setWorkingMessage("");
			ctx.ui.setWorkingIndicator({
				frames: buildFrames(word),
				intervalMs: 90,
			});
			ctx.ui.notify(`Now ${word}…`, "info");
		},
	});
}
