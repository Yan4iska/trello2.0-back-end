import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { TimeBlockDto } from "./dto/time-block.dto";
import { AuthDto } from "../auth/dto/auth.dto";
import { hash } from "argon2";
import { UserDto } from "../user/dto/user.dto";

@Injectable()
export class TimeBlockService {
  constructor(private prisma: PrismaService) {
  }

  async getAll(userId: string) {
    return this.prisma.timeBlock.findMany({
      where: {
        userId,
      },
      orderBy: {
        order: 'asc'
      },
    })
  }

  async create(dto:TimeBlockDto, userId: string) {
    return this.prisma.timeBlock.create({
      data:{
         ...dto,
        user:{
           connect: {
             id:userId
           }
        }

      }
    })
  }

  async update(TimeBlockId:string, userId: string,  dto:Partial<TimeBlockDto>) {
    return this.prisma.timeBlock.update({
      where: {
        userId,
        id: TimeBlockId,
      },
      data: dto
    })
  }


  async delete(timeBlockId: string, userId: string) {
    return this.prisma.timeBlock.delete({
      where:{
        id: timeBlockId,
        userId,
      }
    })
  }

  async updateOrder(ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, order) => this.prisma.timeBlock.update({
        where: { id },
        data: {order},
        })
      )
    )
  }

}