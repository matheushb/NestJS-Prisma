import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  findAll() {
    return this.coursesRepository.find();
  }

  async findById(id: string) {
    const course = await this.coursesRepository.findOne(id);
    if (!course) throw new NotFoundException(`Course ID ${id} not found`);
    return course;
  }

  create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async updateById(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesRepository.preload({
      id: +id,
      ...updateCourseDto,
    });
    if (!course) throw new NotFoundException(`Course ID ${id} not found`);
    return this.coursesRepository.save(course);
  }
  async deleteById(id: string) {
    const course = await this.coursesRepository.findOne(id);
    if (!course) throw new NotFoundException(`Course ID ${id} not found`);
    return this.coursesRepository.remove(course);
  }
}
