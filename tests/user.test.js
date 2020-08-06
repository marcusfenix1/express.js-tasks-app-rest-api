const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { testUser, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Eugene122",
      email: "eugene122@example.com",
      password: "MyPass777!1",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // expect(response.body.user.name).toBe("Eugene122");
  expect(response.body).toMatchObject({
    user: {
      name: "Eugene122",
      email: "eugene122@example.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("MyPass777!1");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ email: testUser.email, password: testUser.password })
    .expect(200);
  const user = await User.findById(testUser._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "random@example.com",
      password: "random22",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(testUser._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/Screenshot_1.jpg")
    .expect(200);

  const user = await User.findById(testUser._id);
  expect(user.avatar).toEqual(expect.any(Buffer)); //to compare objects
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({ name: "Name After Update" })
    .expect(200);

  const user = await User.findById(testUser._id);
  expect(user.name).not.toBe(testUser.name);
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({ category: "Name After Update" })
    .expect(400);
});
