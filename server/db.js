import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_MONGO_URI =
  "mongodb+srv://abhiraj500:abhiraj1000@abhirajcluster.m5pjtjv.mongodb.net/mock_interview?retryWrites=true&w=majority";

const MONGO_URI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

// Cached connection for Serverless environments (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
      console.log(`Connected to MongoDB database: ${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    level: { type: String, default: "SDE-1" },
    topicId: { type: Number, required: true },
    topicName: { type: String, default: "" },
    answer: { type: String, required: true },
    keyConcepts: { type: String, default: "" },
    code: { type: String, default: "" },
    output: { type: String, default: "" },
  },
  { _id: false }
);

const TopicSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    count: { type: Number, default: 0 },
    range: { type: [Number], default: [] },
  },
  { _id: false }
);

const PhaseSchema = new mongoose.Schema(
  {
    phaseId: { type: Number, required: true, unique: true },
    phase: { type: String, required: true },
    totalQuestions: { type: Number, default: 0 },
    topics: [TopicSchema],
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

export const Phase = mongoose.models.Phase || mongoose.model("Phase", PhaseSchema);

// Helper to locate JSON data files across local dev and Vercel
const getDataPath = (filename) => {
  const localPath = path.join(__dirname, "data", filename);
  if (fs.existsSync(localPath)) return localPath;
  const rootPath = path.join(process.cwd(), "server", "data", filename);
  if (fs.existsSync(rootPath)) return rootPath;
  return localPath;
};

// Seed database with bundled phase data if database is empty or missing phases
export async function seedDatabaseIfEmpty() {
  try {
    await connectDB();
    const count = await Phase.countDocuments();
    if (count >= 8) {
      console.log(`MongoDB already populated with ${count} phases.`);
      return;
    }

    console.log("Seeding MongoDB with Phase 1 to Phase 8 data...");
    for (let i = 1; i <= 8; i++) {
      const existing = await Phase.findOne({ phaseId: i });
      if (!existing) {
        const filePath = getDataPath(`phase${i}Data.json`);
        if (fs.existsSync(filePath)) {
          const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
          await Phase.create({
            phaseId: i,
            phase: raw.phase,
            totalQuestions: raw.totalQuestions || raw.questions?.length || 0,
            topics: raw.topics || [],
            questions: raw.questions || [],
          });
          console.log(`Seeded Phase ${i}: ${raw.phase} (${raw.questions?.length} questions)`);
        }
      }
    }
    console.log("MongoDB initial seeding complete!");
  } catch (err) {
    console.error("Error during MongoDB seeding:", err.message);
  }
}
