// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // node-fetch@2
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ Please set GITHUB_TOKEN in server/.env");
  process.exit(1);
}

// --------------------
// Utility Functions
// --------------------
async function graphqlRequest(query, variables = {}) {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "my-docs-tool",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    const err = json.errors ? JSON.stringify(json.errors) : await res.text();
    throw new Error(err);
  }
  return json.data;
}

function parseRepoUrl(urlOrPath) {
  try {
    if (urlOrPath.includes("github.com")) {
      const u = new URL(urlOrPath);
      const parts = u.pathname.replace(/^\/|\/$/g, "").split("/");
      if (parts.length < 2) throw new Error("Invalid GitHub URL");
      return { owner: parts[0], name: parts[1] };
    } else {
      const parts = urlOrPath.replace(/^\/|\/$/g, "").split("/");
      if (parts.length < 2) throw new Error("Invalid owner/repo");
      return { owner: parts[0], name: parts[1] };
    }
  } catch (e) {
    throw new Error("Invalid repo identifier");
  }
}

// --------------------
// GraphQL Queries
// --------------------
const QUERY_DEFAULT_BRANCH = `
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef { name }
    }
  }
`;

const QUERY_TREE = `
  query ($owner: String!, $name: String!, $rev: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $rev) {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`;

const QUERY_BLOB = `
  query ($owner: String!, $name: String!, $expr: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $expr) {
        ... on Blob {
          text
          byteSize
          isBinary
        }
      }
    }
  }
`;

// --------------------
// Routes
// --------------------

// Fetch repo metadata + README + package.json
app.post("/api/fetch-repo", async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: "repoUrl required" });

    const { owner, name } = parseRepoUrl(repoUrl);
    console.log(`📂 Fetching repo: ${owner}/${name}`);

    // 1) Default branch
    const branchData = await graphqlRequest(QUERY_DEFAULT_BRANCH, { owner, name });
    const branch = branchData.repository.defaultBranchRef?.name || "HEAD";

    // 2) List root entries
    const rev = `${branch}:`;
    const treeData = await graphqlRequest(QUERY_TREE, { owner, name, rev });
    const entries = treeData.repository.object?.entries || [];

    // 3) Try README
    const readmeCandidates = ["README.md", "README.MD", "README", "readme.md"];
    let readmeText = null;
    for (const cand of readmeCandidates) {
      try {
        const expr = `${branch}:${cand}`;
        const blobData = await graphqlRequest(QUERY_BLOB, { owner, name, expr });
        const blob = blobData.repository.object;
        if (blob && !blob.isBinary) {
          readmeText = blob.text;
          break;
        }
      } catch (e) {
        // ignore not found
      }
    }

    // 4) Try package.json
    let packageJsonText = null;
    try {
      const expr = `${branch}:package.json`;
      const blobData = await graphqlRequest(QUERY_BLOB, { owner, name, expr });
      const blob = blobData.repository.object;
      if (blob && !blob.isBinary) packageJsonText = blob.text;
    } catch (e) {
      // ignore not found
    }

    return res.json({
      owner,
      name,
      branch,
      entries,
      readme: readmeText || null,
      packageJson: packageJsonText || null,
    });
  } catch (err) {
    console.error("❌ Error in /api/fetch-repo:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Fetch specific file content
app.post("/api/fetch-file", async (req, res) => {
  try {
    const { repoUrl, filePath } = req.body;
    if (!repoUrl || !filePath)
      return res.status(400).json({ error: "repoUrl + filePath required" });

    const { owner, name } = parseRepoUrl(repoUrl);

    const branchData = await graphqlRequest(QUERY_DEFAULT_BRANCH, { owner, name });
    const branch = branchData.repository.defaultBranchRef?.name || "HEAD";

    const expr = `${branch}:${filePath}`;
    const blobData = await graphqlRequest(QUERY_BLOB, { owner, name, expr });
    const blob = blobData.repository.object;

    if (!blob) return res.status(404).json({ error: "file not found" });
    if (blob.isBinary) return res.status(400).json({ error: "file is binary" });

    res.json({ path: filePath, text: blob.text });
  } catch (err) {
    console.error("❌ Error in /api/fetch-file:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Start Server
// --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
