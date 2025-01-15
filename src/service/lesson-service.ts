import { LessonType, QAType, SectionType } from "../models/course/course-model";
import { prisma } from "../prisma";
import createError from "../utils/createError";

export const createLessonService = async (
  lessonsData: { lesson: LessonType; sections: SectionType[] }[]
) => {
  try {
    const lessons = await prisma.$transaction(
      lessonsData.map(({ lesson, sections }) =>
        prisma.lesson.create({
          data: {
            titleLesson: lesson.titleLesson,
            videos: Number(lesson.videos),
            durationLesson: lesson.durationLesson,
            courseId: Number(lesson.id),
            sections: {
              create: sections.map((section) => ({
                titleSection: section.titleSection,
                durationSection: section.durationSection,
                preview: section.preview,
              })),
            },
          },
          include: {
            sections: true,
          },
        })
      )
    );

    return lessons;
  } catch (error) {
    if (error instanceof Error) {
      return createError(error.message, 400);
    }
  }
};

export const getLessonsByCourseIdService = async (id: number) => {
  try {
    const lesson = await prisma.lesson.findMany({
      where: {
        courseId: id,
      },
      include: {
        sections: true,
      },
    });

    return lesson;
  } catch (error) {
    return createError("Error fetching lessons and sections.", 400);
  }
};

export const updateLessonService = async (
  lessonsData: { lesson: LessonType; sections: SectionType[] }[]
) => {
  try {
    const lessons = await prisma.$transaction(
      lessonsData.map(({ lesson, sections }) =>
        prisma.lesson.update({
          where: {
            id: lesson.id,
          },
          data: {
            titleLesson: lesson.titleLesson,
            videos: Number(lesson.videos),
            durationLesson: lesson.durationLesson,
            courseId: Number(lesson.id),
            sections: {
              deleteMany: {},
              create: sections.map((section) => ({
                titleSection: section.titleSection,
                durationSection: section.durationSection,
                preview: section.preview,
              })),
            },
          },
          include: {
            sections: true,
          },
        })
      )
    );

    return lessons;
  } catch (error) {
    if (error instanceof Error) {
      return createError(error.message, 400);
    }
  }
};

// export const updateLessonService = async (data: LessonType) => {
//   const { id, titleLesson, videos, durationLesson } = data;
//   try {
//     const lesson = await prisma.lesson.update({
//       where: {
//         id,
//       },
//       data: {
//         titleLesson,
//         videos: Number(videos),
//         durationLesson,
//         // courseId: Number(id),
//       },
//     });

//     return lesson;
//   } catch (error) {
//     if (error instanceof Error) {
//       return createError(error.message, 400);
//     }
//   }
// };

export const deleteLessonService = async (id: number) => {
  try {
    await prisma.lesson.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return createError(error.message, 400);
    }
  }
};

export const createSectionService = async (data: SectionType) => {
  const { id, titleSection, durationSection, preview } = data;
  const section = await prisma.section.create({
    data: {
      titleSection,
      durationSection,
      preview,
      lessonId: Number(id),
    },
  });

  if (!section) {
    return createError("error create section.", 400);
  }

  return section;
};
