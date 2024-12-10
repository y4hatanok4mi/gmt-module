import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const user = await auth();

      if (!user || !user.user || !user.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const currentUser = await prisma.user.findUnique({
        where: {
          id: Number(user.user.id),
        },
        select: {
          id: true,
          name: true,
          email: true,
          gender: true,
          school: true,
          id_no: true,
          role: true,
        },
      });

      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(currentUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed!" });
  }
}
