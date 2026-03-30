import { prisma } from "../config/db.config.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExist = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (userExist) {
    throw new ApiError("user with this email or username already exist", 409);
  }

  const hashedpass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedpass,
    },
    select: { username: true, email: true },
  });
  if (!user) throw new ApiError("failed to create user");

  return res
    .status(201)
    .json(new ApiResponse(201, "user created successfully", user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const isUserExist = await prisma.user.findFirst({
    where: {
      email 
    },
    select: { username: true, password: true, id: true },
  });

  if (!isUserExist) throw new ApiError("invalid credentials", 401);

  const comparePass = await bcrypt.compare(password, isUserExist.password);
  if (!comparePass) throw new ApiError("invalid credentials", 401);

  const refreshToken = jwt.sign(
    { id: isUserExist.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(200, "logged in successfully", {
        user: { username: isUserExist.username,id:isUserExist.id },
      }),
    );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json(new ApiResponse(200, "logout successful"));
});

export const me = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId },select:{id:true,username:true,email:true} });
  if (!user) throw new ApiError("invalid user id", 402);
  return res
    .status(200)
    .json(
      new ApiResponse(200, "current user", {
        user,
      }),
    );
});
