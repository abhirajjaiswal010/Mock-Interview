import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB, Phase, seedDatabaseIfEmpty } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to locate JSON data files across local development and Vercel serverless environments
const getDataPath = (filename) => {
  const localPath = path.join(__dirname, "data", filename);
  if (fs.existsSync(localPath)) return localPath;
  const rootPath = path.join(process.cwd(), "server", "data", filename);
  if (fs.existsSync(rootPath)) return rootPath;
  return localPath;
};

// Helper to safely load JSON files as fallback
const loadJson = (filename) => {
  try {
    const filePath = getDataPath(filename);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return { phase: "Unknown", totalQuestions: 0, topics: [], questions: [] };
  }
};

// Fallback in-memory data
const fallbackPhasesMap = {
  1: loadJson("phase1Data.json"),
  2: loadJson("phase2Data.json"),
  3: loadJson("phase3Data.json"),
  4: loadJson("phase4Data.json"),
  5: loadJson("phase5Data.json"),
  6: loadJson("phase6Data.json"),
  7: loadJson("phase7Data.json"),
  8: loadJson("phase8Data.json"),
};

// Initialize DB and ensure initial seed
connectDB()
  .then(() => seedDatabaseIfEmpty())
  .catch((err) => console.warn("MongoDB auto-connect warning:", err.message));

const router = express.Router();

// 1. Get all available phases
router.get("/phases", async (req, res) => {
  try {
    await connectDB();
    const phaseDocs = await Phase.find({}, "phaseId phase totalQuestions topics").sort({ phaseId: 1 }).lean();

    if (phaseDocs && phaseDocs.length > 0) {
      return res.json({
        phases: phaseDocs.map((p) => ({
          id: p.phaseId,
          title: p.phase,
          totalQuestions: p.totalQuestions,
          topics: p.topics,
        })),
      });
    }
  } catch (err) {
    console.warn("MongoDB unavailable for /phases, serving fallback:", err.message);
  }

  // Fallback to local files
  res.json({
    phases: Object.entries(fallbackPhasesMap).map(([id, data]) => ({
      id: parseInt(id, 10),
      title: data.phase,
      totalQuestions: data.totalQuestions,
      topics: data.topics,
    })),
  });
});

// 2. Get questions by phase and topic
router.get("/questions", async (req, res) => {
  const phaseId = parseInt(req.query.phase || "1", 10);
  const { topicId } = req.query;

  try {
    await connectDB();
    const phaseDoc = await Phase.findOne({ phaseId }).lean();

    if (phaseDoc) {
      if (topicId && topicId !== "all") {
        const filtered = phaseDoc.questions.filter((q) => q.topicId === parseInt(topicId, 10));
        return res.json({ phase: phaseDoc.phase, questions: filtered, total: filtered.length });
      }
      return res.json({ phase: phaseDoc.phase, questions: phaseDoc.questions, total: phaseDoc.totalQuestions });
    }
  } catch (err) {
    console.warn(`MongoDB unavailable for questions phase ${phaseId}, serving fallback:`, err.message);
  }

  // Fallback
  const data = fallbackPhasesMap[phaseId] || fallbackPhasesMap[1];
  if (topicId && topicId !== "all") {
    const filtered = data.questions.filter((q) => q.topicId === parseInt(topicId, 10));
    return res.json({ phase: data.phase, questions: filtered, total: filtered.length });
  }

  res.json({ phase: data.phase, questions: data.questions, total: data.totalQuestions });
});

// 3. Update an individual question's answer
router.put("/questions/:phaseId/:questionId", async (req, res) => {
  const phaseId = parseInt(req.params.phaseId, 10);
  const questionId = parseInt(req.params.questionId, 10);
  const { answer } = req.body;

  if (typeof answer !== "string") {
    return res.status(400).json({ error: "Answer must be a valid string." });
  }

  let updatedQuestion = null;

  try {
    await connectDB();
    const result = await Phase.updateOne(
      { phaseId, "questions.id": questionId },
      { $set: { "questions.$.answer": answer } }
    );
    if (result.matchedCount > 0) {
      updatedQuestion = { id: questionId, answer };
    }
  } catch (err) {
    console.warn("MongoDB update error:", err.message);
  }

  // Also update in-memory fallback
  const fallbackPhase = fallbackPhasesMap[phaseId];
  if (fallbackPhase) {
    const q = fallbackPhase.questions?.find((item) => item.id === questionId);
    if (q) {
      q.answer = answer;
      if (!updatedQuestion) updatedQuestion = q;
    }
  }

  // Sync to local data files if writable local environment
  if (!process.env.VERCEL) {
    try {
      const serverJsonPath = getDataPath(`phase${phaseId}Data.json`);
      if (fallbackPhase && fs.existsSync(serverJsonPath)) {
        fs.writeFileSync(serverJsonPath, JSON.stringify(fallbackPhase, null, 2), "utf8");
      }
      const clientJsPath = path.join(__dirname, "..", "client", "src", "data", `phase${phaseId}Data.js`);
      if (fallbackPhase && fs.existsSync(clientJsPath)) {
        fs.writeFileSync(
          clientJsPath,
          `export const phase${phaseId}Data = ${JSON.stringify(fallbackPhase, null, 2)};\n`,
          "utf8"
        );
      }
    } catch (err) {
      // Ignore disk write failure in read-only environment
    }
  }

  if (!updatedQuestion) {
    return res.status(404).json({ error: `Question ${questionId} not found in Phase ${phaseId}.` });
  }

  return res.json({
    success: true,
    message: "Answer updated successfully.",
    question: updatedQuestion,
  });
});

// 4. Add a new question to a phase & topic
router.post("/questions", async (req, res) => {
  const { phaseId, topicId, title, level, answer, keyConcepts, code, output } = req.body;

  const pId = parseInt(phaseId, 10);
  const tId = parseInt(topicId, 10);

  if (!pId || !tId || !title || !answer) {
    return res.status(400).json({ error: "phaseId, topicId, title, and answer are required." });
  }

  let createdQuestion = null;
  let totalCount = 0;

  try {
    await connectDB();
    const phaseDoc = await Phase.findOne({ phaseId: pId });
    if (phaseDoc) {
      const topicObj = phaseDoc.topics.find((t) => t.id === tId);
      const maxId = phaseDoc.questions.reduce((max, q) => (q.id > max ? q.id : max), 0);
      const newQuestionId = maxId + 1;

      createdQuestion = {
        id: newQuestionId,
        title: title.trim(),
        level: level || "SDE-1",
        topicId: tId,
        topicName: topicObj ? topicObj.name : "General",
        answer: answer.trim(),
        keyConcepts: (keyConcepts || "").trim(),
        code: (code || "").trim(),
        output: (output || "").trim(),
      };

      phaseDoc.questions.push(createdQuestion);
      phaseDoc.totalQuestions = phaseDoc.questions.length;
      if (topicObj) {
        topicObj.count = (topicObj.count || 0) + 1;
        if (Array.isArray(topicObj.range)) {
          topicObj.range[1] = Math.max(topicObj.range[1] || 0, newQuestionId);
        }
      }
      await phaseDoc.save();
      totalCount = phaseDoc.totalQuestions;
    }
  } catch (err) {
    console.warn("MongoDB insert error:", err.message);
  }

  // Update fallback in-memory cache as well
  const fallbackPhase = fallbackPhasesMap[pId];
  if (fallbackPhase) {
    const topicObj = fallbackPhase.topics?.find((t) => t.id === tId);
    if (!createdQuestion) {
      const maxId = fallbackPhase.questions.reduce((max, q) => (q.id > max ? q.id : max), 0);
      const newQuestionId = maxId + 1;
      createdQuestion = {
        id: newQuestionId,
        title: title.trim(),
        level: level || "SDE-1",
        topicId: tId,
        topicName: topicObj ? topicObj.name : "General",
        answer: answer.trim(),
        keyConcepts: (keyConcepts || "").trim(),
        code: (code || "").trim(),
        output: (output || "").trim(),
      };
      fallbackPhase.questions.push(createdQuestion);
      fallbackPhase.totalQuestions = fallbackPhase.questions.length;
      if (topicObj) {
        topicObj.count = (topicObj.count || 0) + 1;
      }
      totalCount = fallbackPhase.totalQuestions;
    }
  }

  // Local data sync
  if (!process.env.VERCEL) {
    try {
      const serverJsonPath = getDataPath(`phase${pId}Data.json`);
      if (fallbackPhase && fs.existsSync(serverJsonPath)) {
        fs.writeFileSync(serverJsonPath, JSON.stringify(fallbackPhase, null, 2), "utf8");
      }
      const clientJsPath = path.join(__dirname, "..", "client", "src", "data", `phase${pId}Data.js`);
      if (fallbackPhase && fs.existsSync(clientJsPath)) {
        fs.writeFileSync(
          clientJsPath,
          `export const phase${pId}Data = ${JSON.stringify(fallbackPhase, null, 2)};\n`,
          "utf8"
        );
      }
    } catch (err) {
      // Ignore
    }
  }

  return res.status(201).json({
    success: true,
    message: "Question added and saved successfully.",
    question: createdQuestion,
    totalQuestions: totalCount,
  });
});

// Mount router on both '/api' and '/'
app.use("/api", router);
app.use(router);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    time: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
  });
}

export default app;
