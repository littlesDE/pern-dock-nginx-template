import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import prisma from "../prisma";

const router = Router();

router.get("/profile", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { firstName, lastName, avatarUrl, bio } = req.body;
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { firstName, lastName, avatarUrl, bio },
    });
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
