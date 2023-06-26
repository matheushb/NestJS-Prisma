import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';

@Injectable()
export class CoursesService {
  private courses: Course[] = [
    {
      id: 1687798577609,
      name: 'Fundamentos do Framework NestJS',
      description: 'Fundamentos do Framework NestJS',
      tags: ['node.js', 'nestjs', 'typescript', 'javascript'],
    },
  ];

  findAll() {
    return this.courses;
  }

  findById(id: string) {
    const course = this.courses.find((course) => course.id === Number(id));
    if (!course)
      throw new HttpException(
        `Course ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    return course;
  }

  create(createCourseDto: CreateCourseDto) {
    const newCourse = Object.assign(createCourseDto, { id: Date.now() });
    this.courses.push(createCourseDto);
    return newCourse;
  }

  updateById(id: string, updateCourseDto: UpdateCourseDto) {
    return Object.assign(this.findById(id), updateCourseDto);
  }
  deleteById(id: string) {
    const courseIndex = this.courses.findIndex(
      (course) => course.id === Number(id),
    );
    if (courseIndex === -1) {
      throw new HttpException(
        `Course ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.courses.splice(courseIndex, 1);
  }
}
