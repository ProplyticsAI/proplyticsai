import { createMockApiApp } from "./app";

const port = Number(process.env.PORT || 4317);
const app = createMockApiApp();

app.listen(port, () => {
  console.log(`Proplytic Mock API läuft auf http://localhost:${port}/v1`);
  console.log("Demo-PAT: mock-valid-token");
});
