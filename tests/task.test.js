const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
  testUser,
  setupDatabase,
  testTaskOne,
  secondTestUser,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({ title: "test task", description: "test description" })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should receive all tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Should not delete other users tasks", async () => {
  const response = await request(app)
    .delete(`/tasks/${testTaskOne._id}`)
    .set("Authorization", `Bearer ${secondTestUser.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(testTaskOne._id);
  expect(task).not.toBeNull();
});
