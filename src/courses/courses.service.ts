import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  findAll() {
    return this.coursesRepository.find();
  }

  async findById(id: string) {
    const course = await this.coursesRepository.findOne(id);
    if (!course) throw new NotFoundException(`Course ID ${id} not found`);
    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    const tags = await Promise.all(
      createCourseDto.tags.map((tag) => this.preloadTagByName(tag)),
    );
    const course = this.coursesRepository.create({
      ...createCourseDto,
      tags,
    });
    return this.coursesRepository.save(course);
  }

  async updateById(id: string, updateCourseDto: UpdateCourseDto) {
    const tags =
      updateCourseDto.tags &&
      (await Promise.all(
        updateCourseDto.tags.map((tag) => this.preloadTagByName(tag)),
      ));

    const course = await this.coursesRepository.preload({
      id: +id,
      ...updateCourseDto,
      tags,
    });
    if (!course) throw new NotFoundException(`Course ID ${id} not found`);
    return this.coursesRepository.save(course);
  }
  async deleteById(id: string) {
    const course = await this.coursesRepository.findOne(id);

    if (!course) throw new NotFoundException(`Course ID ${id} not found`);

    return this.coursesRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ name });

    if (!tag) {
      this.tagRepository.create({ name });
    }

    return tag;
  }
}
