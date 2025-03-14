import { Hono } from "hono";
import { db } from "@/db/index";
import { tableA, tableB, tableC } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const app = new Hono().basePath("/api");

// ✅ Create a test for a student
app.post("/test/:level", async (c) => {
  const { level } = c.req.param();
  const { studentId, test1, test2, test3 } = await c.req.json();

  if (level === "A") {
    await db.insert(tableA).values({ studentId, test1, test2, test3, status: "pending" });
    return c.json({ message: "Test A created" });
  }

  if (level === "B") {
    const levelA = await db.select().from(tableA).where(eq(tableA.studentId, studentId));
    if (!levelA.length) return c.json({ error: "Complete Level A first" }, 400);

    await db.insert(tableB).values({ studentId, test1, test2, test3, status: "pending", dependsOn: levelA[0].id });
    return c.json({ message: "Test B created" });
  }

  if (level === "C") {
    const levelB = await db.select().from(tableB).where(eq(tableB.studentId, studentId));
    if (!levelB.length) return c.json({ error: "Complete Level B first" }, 400);

    await db.insert(tableC).values({ studentId, test1, test2, test3, status: "pending", dependsOn: levelB[0].id });
    return c.json({ message: "Test C created" });
  }

  return c.json({ error: "Invalid level" }, 400);
});


// ✅ List all tests for a given level
app.get("/tests/:level", async (c) => {
  const { level } = c.req.param();

  if (level === "A") {
    const tests = await db.select().from(tableA);
    return c.json(tests);
  }
  if (level === "B") {
    const tests = await db.select().from(tableB);
    return c.json(tests);
  }
  if (level === "C") {
    const tests = await db.select().from(tableC);
    return c.json(tests);
  }

  return c.json({ error: "Invalid level" }, 400);
});

// ✅ List incomplete tasks
app.get("/incomplete-tests", async (c) => {
  try {
    const levelA = await db.select().from(tableA).where(eq(tableA.status, "pending"));
    const levelB = await db.select().from(tableB).where(eq(tableB.status, "pending"));
    const levelC = await db.select().from(tableC).where(eq(tableC.status, "pending"));

    return c.json({ levelA, levelB, levelC });
  } catch (error) {
    console.error("Error fetching incomplete tests:", error);
    return c.json({ error: "Something went wrong" }, 500);
  }
});


// ✅ List completed tasks
app.get("/completed-tests", async (c) => {
  const levelA = await db
    .select()
    .from(tableA)
    .where(sql`${tableA.status} = 'pending' or ${tableA.status} is null`);

  const levelB = await db
    .select()
    .from(tableB)
    .where(sql`${tableB.status} = 'pending' or ${tableB.status} is null`);

  const levelC = await db
    .select()
    .from(tableC)
    .where(sql`${tableC.status} = 'pending' or ${tableC.status} is null`);

    console.log("Level A Incomplete:", levelA);
    console.log("Level B Incomplete:", levelB);
    console.log("Level C Incomplete:", levelC);


  return c.json({ levelA, levelB, levelC });
});

export default app;
