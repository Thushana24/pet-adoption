import { RegisterUserSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import argon2 from "argon2";
import handleError from "../helpers/handleError";
import generateToken from "../helpers/generateToken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterUserSchema.parse(body);

    const { firstName, lastName, email, password } = validatedData;

    const isUserExist = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_ALREADY_EXISTS",
            message: "User is already exist",
          },
        },
        { status: 409 }
      );
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(newUser?.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: newUser,
          token,
        },

        message: "User created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Failed to register user");
  }
}
