import { api } from './client'

export const enrollmentsApi = {
  list: () => api.get('/enrollments'),
  create: (courseId, userId) =>
    api.post('/enrollments', {
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
    }),
  delete: (id) => api.del(`/enrollments/${id}`),
}
