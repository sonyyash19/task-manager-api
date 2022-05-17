const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Soni',
    email: 'soni@example.com',
    password: '87what!!'
}

beforeEach( async() => {
    await User.deleteMany();
    await new User(userOne).save();
})

test('Should signup a new user', async() => {
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'and@example.com',
        password: 'Mypass877!'
    }).expect(201);
}) 

test('Should login existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
})

test('Should not login non existent user', async() => {
    await request(app).post('/users/login').send({
        email: 'yash@soni.com',
        password: '1234@yash'
    }).expect(400);
})