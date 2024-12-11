import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CacheUser } from 'src/dto/common-request.dto';
import { PageDto } from 'src/dto/paginate.dto';
import { CreateTopicDto, UpdateTopicDto } from 'src/dto/topic/create-topic.dto';
import { SearchTopicDto } from 'src/dto/topic/search-topic.dto';
import { PermissionHelper } from 'src/helper/permisson-helper.service';
import { TopicHelper } from 'src/helper/topic-helper.service';
import { App404Exception, AppExistedException } from 'src/middleware/app-error-handler';
import { CondUtil } from 'src/utils/condition';
import { GenerateUtil } from 'src/utils/generate';
import { HelperUtils } from 'src/utils/helpers';
import { QueryUtil } from 'src/utils/query';
import { DataSource } from 'typeorm';
import { Topic } from './../../entities/vocabulary/topic.entity';
import { RoleHelper } from 'src/helper/role-helper.service';

@Injectable()
export class TopicService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  search = async (query: SearchTopicDto): Promise<PageDto<Topic>> => {
    const [data, itemCount] = await Topic.findAndCount({
      select: {
        id: true,
        name: true,
        classroomId: true,
        imageLocation: true,
        description: true,
        createdAt: true,
        creatorId: true,
        isCommon: true,
        classroom: {
          id: true,
          name: true,
          classLevel: true,
        },
      },
      where: TopicHelper.getFilterSearchTopic(query),
      relations: { classroom: true },
      order: QueryUtil.getSort(query.orderBy, query.sortBy),
      skip: query.skip,
      take: query.take,
    });

    return GenerateUtil.paginate({ data, itemCount, query });
  };

  async createTopic(userId: number, body: CreateTopicDto, permissionCode) {
    const isExistByName = await HelperUtils.existByName(Topic, body.name, 'name');
    if (isExistByName) throw new AppExistedException('name', body);

    const isPermission = await PermissionHelper.isPermissionChange(userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    const topic = new Topic();
    topic.name = body.name;
    topic.imageLocation = body.imageLocation;
    topic.classroomId = body.classroomId;
    topic.description = body.description;
    topic.creatorId = body.creatorId;
    topic.isCommon = body.isCommon;
    return await topic.save();
  }

  getById = async (id: number): Promise<Topic> => {
    const classRoom = await Topic.findOne({
      select: {
        classroom: {
          id: true,
          name: true,
          classLevel: true,
        },
      },
      where: { id },
      relations: { classroom: true },
    });
    if (!classRoom) throw new App404Exception('id', { id });
    return classRoom;
  };

  updateById = async (id: number, user: CacheUser, body: UpdateTopicDto, permissionCode: string): Promise<Topic> => {
    const topic = await Topic.findOne({ where: { id } });
    if (!topic) throw new App404Exception('id', { id });

    if (body.name != topic.name) {
      const isExistByName = await HelperUtils.existByName(Topic, body.name, 'name');
      if (isExistByName) throw new AppExistedException('name', body);
    }
    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    CondUtil.saveIfChanged(topic, body, ['name', 'imageLocation', 'classroomId', 'description', 'creatorId']);

    return await topic.save();
  };

  deleteById = async (id: number, user: CacheUser, permissionCode): Promise<any> => {
    let topic;
    const userRole = await RoleHelper.getRoleByUserId(user.userId);
    if (userRole.code === 'ADMIN') {
      topic = await Topic.findOne({ where: { id } });
    } else {
      topic = await Topic.findOne({ where: { id, creatorId: user.userId } });
    }

    if (!topic) throw new App404Exception('id', { id });

    const isPermission = await PermissionHelper.isPermissionChange(user.userId, permissionCode);
    if (!isPermission) throw new App404Exception('permissionCode', { permissionCode });

    await topic.remove();
    return true;
  };
}
