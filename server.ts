import * as express from "express";
import * as path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve static files from 'dist' (production bundle) and the root workspace
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.use(express.static(process.cwd()));

  // Serve the master standalone index.html for all incoming routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        res.sendFile(path.join(process.cwd(), "index.html"));
      }
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running directly from index.html on port ${PORT}`);
  });
}

startServer();
