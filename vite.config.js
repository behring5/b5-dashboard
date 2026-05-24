import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],

	base: './',
	build: {
		outDir: 'dist', // output folder
		emptyOutDir: true, // clear dist folder before build
		assetsInlineLimit: 0, // avoid base64 string formatting

		rollupOptions: {
			output: {
				entryFileNames: 'app.js',

				assetFileNames: (assetInfo) => {
					// name css file style.css
					if (assetInfo.name.endsWith('.css')) {
						return 'style.css';
					}

					// font files in seperate font folder
					if (/\.(ttf|woff2?|eot|otf)$/i.test(assetInfo.name)) {
						return `assets/fonts/[name][extname]`;
					}

					// 2. Prüfung auf den 'weather' Ordner
					// assetInfo.name enthält bei Vite oft den relativen Pfad zum Projekt-Root
					const originalPath = assetInfo.originalFileName || '';

					// Prüfen, ob die Datei aus dem weather-Ordner stammt
					if (originalPath.includes('assets/weather/')) {
						return `assets/weather/[name][extname]`;
					}

					// images
					// if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
					// 	return `assets/[name][extname]`;
					// }

					// Standardpfad für andere Assets (z.B. CSS)
					return `assets/[name][extname]`;
				},

				// preserveModules: true,
			},
		},
	},
});
