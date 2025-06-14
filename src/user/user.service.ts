import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { AuthDto } from "../auth/dto/auth.dto";
import { hash } from "argon2";
import { UserDto } from "./dto/user.dto";
import { startOfDay, subDays } from "date-fns";

@Injectable()
export class UserService {
  constructor(private  prisma: PrismaService) {}

   getById(id:string){
    return this.prisma.user.findUnique({
      where: {
        id
      },
      include: {tasks: true }
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      },
    })
  }

  async getProfile(id: string) {
    const profile = await this.getById(id);

    const totalTasks = profile.tasks.length
    const completedTasks = await this.prisma.task.count({
      where: {
        userId: id,
        isCompleted: true,
      }
    })



    const todayStart = startOfDay(new Date())
    const weekStart = startOfDay(subDays(new Date(), 7))

    const todayTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString()
        }
      }
    })

    const weekTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString()
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...rest} = profile
    return {
      user: rest,
      statistics: [
        {label: 'Total', val: totalTasks },
        {label: 'Completed tasks', val: completedTasks},
        {label: 'Today tasks', val: todayTasks},
        {label: 'Week tasks', val: weekTasks},
      ]
    }

  }



  async create(dto:AuthDto) {
    const user = {
      email: dto.email,
      name: '',
      password: await hash(dto.password),
    }

    return this.prisma.user.create({
      data:user
    })
  }

  async update(id:string, dto:UserDto) {
    let data = dto
    if (dto.password) {
      data = {...dto, password: await hash(dto.password)}
    }

    return this.prisma.user.update({
      where: {
        id
      },
      data,
      select: {
        name: true,
        email: true,
      }
    })
  }
}
