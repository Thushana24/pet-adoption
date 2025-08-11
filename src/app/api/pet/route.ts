import { NextRequest, NextResponse } from "next/server";
import privateRoute from "../auth/helpers/privateRoute";
import { PetPostSchema, PetQuerySchema } from "@/schemas/pet.schema";
import prisma from "@/lib/prisma";
import handleError from "../auth/helpers/handleError";
import getPaginationParams from "../auth/helpers/getPaginationParams";
import { getSearchQuery } from "../auth/helpers/getSearchQuery";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  return privateRoute(request, async (user) => {
    try {
      const body = await request.json();
      const validatedData = PetPostSchema.parse(body);
      const ownerId = user?.id;

      const pet = await prisma.pet.create({
        data: {
          owner: { connect: { id: ownerId } },
          ...validatedData,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: pet,
          message: "Pet created successfully.",
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "Failed to create pet");
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const PaginationSchema = PetQuerySchema.omit({ search: true });
    const SearchSchema = PetQuerySchema.pick({ search: true });

    const { page, size } = getPaginationParams({
      request,
      schema: PaginationSchema,
    });

    const { search: searchText } = getSearchQuery({
      request,
      schema: SearchSchema,
    });

    const searchFilter: Prisma.PetWhereInput = searchText
      ? {
          OR: [
            { type: { contains: searchText, mode: "insensitive" as const } },
            { breed: { contains: searchText, mode: "insensitive" as const } },
            { color: { contains: searchText, mode: "insensitive" as const } },
            { age: { contains: searchText, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [pets, count] = await prisma.$transaction([
      prisma.pet.findMany({
        where: { ...searchFilter },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              contact: true,
              email: true,
            },
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.pet.count({ where: { ...searchFilter } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          items: pets,
          count,
          pagination: {
            page,
            size,
            totalPages: Math.ceil(count / size),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Failed to fetch pet");
  }
}
