import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

let frontend, backend;

test.beforeAll(async () => {

  // Start backend
  backend = spawn("npm", ["run", "start-backend"], {
    shell: true,
    stdio: "inherit"
  });

  // Start frontend (Vite)
  frontend = spawn("npm", ["run", "dev"], {
    shell: true,
    stdio: "inherit"
  });

  // Wait for servers to come online
  console.log("Waiting for frontend + backend to start…");
  await new Promise(r => setTimeout(r, 4000)); // 4 seconds is enough
});

test.afterAll(() => {
  backend.kill();
  frontend.kill();
});

test("Loads homepage and shows data", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Example click that triggers DB/API
  await page.click("#loadPlayersButton");

  // Assert DB data appears
  await expect(page.locator(".player-row").first()).toContainText("LeBron");
});
