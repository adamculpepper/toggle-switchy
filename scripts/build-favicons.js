// Rebuilds the raster favicons from docs/favicon.svg. Run after changing the SVG:
//   node scripts/build-favicons.js
//
// Writes, all committed and served from docs/:
//   docs/favicon.ico           16, 32 and 48 in one file
//   docs/favicon.png           96x96
//   docs/apple-touch-icon.png  180x180, square and fully opaque
//
// Google's results draw the site icon in a circle and fill transparent pixels with
// white, and when a site has a 180px apple-touch-icon that is the file it shows. The
// switch sits on a transparent ground, so the apple-touch-icon puts it on the page's
// own white with room around it, and keeps no alpha channel at all.
//
// The repo has no package.json, so sharp is not a dependency. It is loaded from
// SHARP_PATH if set, then from anywhere node can resolve it, then from purecss.com.

const fs = require("fs");
const path = require("path");

function loadSharp() {
	const tries = [process.env.SHARP_PATH, "sharp", "C:/repos/purecss.com/node_modules/sharp"].filter(Boolean);
	for (const id of tries) {
		try {
			return require(id);
		} catch {}
	}
	throw new Error("sharp not found. Run `npm install --no-save sharp` in this folder, or set SHARP_PATH to a sharp install.");
}
const sharp = loadSharp();

const DOCS = path.join(__dirname, "../docs");
const GROUND = "#ffffff"; // the page background
const TOUCH_SIZE = 180;
const TOUCH_ART = 128; // the switch is drawn at this size inside the 180 tile

const svg = fs.readFileSync(path.join(DOCS, "favicon.svg"));
const svgWidth = Number(String(svg).match(/<svg[^>]*\swidth="([\d.]+)"/)[1]);

// Each size is drawn at its own density, never drawn small and enlarged.
const render = (px) => sharp(svg, { density: (72 * px) / svgWidth }).resize(px, px).png().toBuffer();

// One .ico holding a PNG per size, so each place that reads it takes the size it needs.
function ico(pngs) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(pngs.length, 4);
	let offset = 6 + pngs.length * 16;
	const entries = pngs.map(({ size, data }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size, 0);
		entry.writeUInt8(size, 1);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += data.length;
		return entry;
	});
	return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function touchIcon() {
	const art = await render(TOUCH_ART);
	const inset = (TOUCH_SIZE - TOUCH_ART) / 2;
	return sharp({ create: { width: TOUCH_SIZE, height: TOUCH_SIZE, channels: 3, background: GROUND } })
		.composite([{ input: art, left: inset, top: inset }])
		.flatten({ background: GROUND })
		.removeAlpha()
		.png()
		.toBuffer();
}

function write(name, buf) {
	fs.writeFileSync(path.join(DOCS, name), buf);
	console.log("  docs/" + name.padEnd(22) + (buf.length / 1024).toFixed(1) + " KB");
}

async function main() {
	console.log("favicons rebuilt from docs/favicon.svg:");
	write("favicon.ico", ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await render(size) })))));
	write("favicon.png", await render(96));
	write("apple-touch-icon.png", await touchIcon());
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
