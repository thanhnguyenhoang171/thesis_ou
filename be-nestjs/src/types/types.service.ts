import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { TypeDocument } from './schemas/type.schema';
import aqp from 'api-query-params';
import { of } from 'rxjs';
import mongoose from 'mongoose';

@Injectable()
export class TypesService {
  constructor(
    @InjectModel(Type.name)
    private TypeModel: SoftDeleteModel<TypeDocument>,
  ) {}

  async create(createTypeDto: CreateTypeDto, user: IUser) {
    try {
      const { name, description, logo } = createTypeDto;
      const newType = await this.TypeModel.create({
        name,
        description,
        logo,
        createdBy: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
      return {
        _id: newType._id,
        cratedAt: newType.createdAt,
      };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let page = Math.max(1, +currentPage);
    let defaultLimit = +limit > 0 ? +limit : 10;
    let offset = (page - 1) * defaultLimit;

    // Xử lý tìm kiếm với regex (chỉ khi `name` tồn tại)
    if (filter.name && typeof filter.name === 'string') {
      filter.name = { $regex: new RegExp(filter.name, 'i') };
    }

    const totalItems = await this.TypeModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.TypeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any || { updatedAt: -1 })
      .populate(population || [])
      .exec();

    return {
      meta: {
        current: page,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID không hợp lệ!');
      }
      return await this.TypeModel.findById(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return error;
      }
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  async update(id: string, updateTypeDto: UpdateTypeDto, user: IUser) {
    try {
      const { name, description, logo } = updateTypeDto;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID không hợp lệ');
      }
      const isExist = await this.TypeModel.findById(id);
      if (!isExist) {
        throw new BadRequestException('Không tìm thấy Type này!');
      }
      const newType = await this.TypeModel.updateOne(
        { _id: id },
        {
          name,
          description,
          logo,
          updatedBy: {
            _id: user._id,
            email: user.email,
            name: user.name,
          },
        },
      );
      return newType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return error;
      }
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  async remove(id: string, user: IUser) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID không hợp lệ!');
      }
      const isExist = await this.TypeModel.findById(id);
      if (!isExist) {
        throw new BadRequestException('Không tìm thấy Type này!');
      }
      const removedType = await this.TypeModel.softDelete({ _id: id });
      return removedType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        return error;
      }
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }
}
