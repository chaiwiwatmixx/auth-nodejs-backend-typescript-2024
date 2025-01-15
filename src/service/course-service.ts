import { CourseType, QAType } from "../models/course/course-model";
import { prisma } from "../prisma";
import createError from "../utils/createError";

export const createCourseService = (dataCourse: CourseType) => {
  const {
    id,
    title,
    subDescription,
    description,
    originalPrice,
    price,
    whoIsThisFor,
    teacher,
    image,
  } = dataCourse;
  const course = prisma.course.create({
    data: {
      adminId: id,
      title,
      subDescription,
      description,
      originalPrice: Number(originalPrice),
      price: Number(price),
      whoIsThisFor,
      teacher,
      image,
    },
  });

  if (!course) {
    return createError("error create update product.", 400);
  }

  return course;
};

export const getProductsService = () => {
  const products = prisma.course.findMany();

  if (!products) {
    return createError("No products found.", 400);
  }
  return products;
};

export const getProductByIdService = (id: number) => {
  const product = prisma.course.findUnique({
    where: { id },
  });

  if (!product) {
    return createError("No products found.", 400);
  }
  return product;
};

export const updateCourseService = (dataCourse: CourseType) => {
  const {
    id,
    title,
    subDescription,
    description,
    originalPrice,
    price,
    whoIsThisFor,
    teacher,
    image,
  } = dataCourse;
  const course = prisma.course.update({
    where: { id: id },
    data: {
      title,
      subDescription,
      description,
      originalPrice: Number(originalPrice),
      price: Number(price),
      whoIsThisFor,
      teacher,
      image,
    },
  });

  if (!course) {
    return createError("error create update product.", 400);
  }

  return course;
};

export const deleteCourseService = (id: number) => {
  return prisma.course.delete({
    where: {
      id: id,
    },
  });
};

export const createQAService = (data: QAType) => {
  const { id, question, answer } = data;
  const qa = prisma.question.create({
    data: {
      question,
      answer,
      courseId: Number(id),
    },
  });

  if (!qa) {
    return createError("error create qa.", 400);
  }

  return qa;
};
