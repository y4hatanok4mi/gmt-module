import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          gender: true,
          school: true,
          id_no: true,
          role: true,
        },
      })
      res.status(200).json(users)
    } catch (error) {
      console.error("Error fetching users:", error)
      res.status(500).json({ error: "Failed to fetch users" })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed!" })
  }
}