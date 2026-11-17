import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { apiFalsa } from "./servidor-falso.js";

export default defineConfig({ plugins: [react(), apiFalsa()] });
