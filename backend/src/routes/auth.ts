import { Router, Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../utils/mailer";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        profile: { create: {} }
      }
    });
    const verifyUrl = `https://sliot.zapto.org/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: '"App" <noreply@deineapp.de>',
      to: email,
      subject: "Bitte bestätige deine E-Mail",
      html: `<p>Klicke <a href="${verifyUrl}">hier</a>, um deine E-Mail zu bestätigen.</p>`
    });
    res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/verify-email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "Token required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { verificationToken: token } });
    if (!user) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null }
    });
    res.json({ message: "Email verified. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/request-password-reset", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(200).json({ message: "If the email exists, a reset link was sent." });
      return;
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken }
    });
    const resetUrl = `https://sliot.zapto.org/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: '"App" <noreply@deineapp.de>',
      to: email,
      subject: "Passwort zurücksetzen",
      html: `<p>Klicke <a href="${resetUrl}">hier</a>, um dein Passwort zurückzusetzen.</p>`
    });
    res.json({ message: "If the email exists, a reset link was sent." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.body.token;
    const password = req.body.password || req.body.newPassword;
    if (!token || !password) {
      res.status(400).json({ error: "Token and new password required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { resetToken: token } });
    if (!user) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null }
    });
    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (!user.emailVerified) {
      res.status(403).json({ error: "Email not verified" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/login", (req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;
