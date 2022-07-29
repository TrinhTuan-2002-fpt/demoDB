const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');

let token, id, tokenUser;
// Connects to database before running tests
beforeAll(async () => {
    await mongoose.connect(config.getDBUri(), config.DB.CONFIGS);
    const res = await request(server).post(KeyTest.config.Auth.Login).send(KeyTest.DataPass.LoginFUllRoles);
    token = res.body.token.access.token;
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
 });

describe('TEST USER FUNCTION  ', () => {
    describe('Post User function', () => {
        test('Post User Pass ', async () => {
            const res = await request(server).post(KeyTest.config.User).set('Authorization', `Bearer ${token}`).send({
                name: KeyTest.DataPass.User.name,   
                email: KeyTest.DataPass.User.email,
                password: KeyTest.DataPass.User.password,
                roles: ['manager']
            });
            id = res.body._id;
            console.log(res.body);
            expect(res.statusCode).toBe(201);
        });
        test('Post User Fail Send Null ', async () => {
            const res = await request(server).post(KeyTest.config.User).set('Authorization', `Bearer ${token}`)
            .send(KeyTest.Null);
            expect(res.statusCode).toBe(400);
        });

        test('Post User Fail Send Null token', async () => {
            const res = await request(server).post(KeyTest.config.User).send(KeyTest.DataPass.User);
            expect(res.statusCode).toBe(401);
        });
        
        test('Post User Fail Password wrong', async () => {
            const res = await request(server).post(KeyTest.config.User).set('Authorization', `Bearer ${token}`)
            .send({
                name: KeyTest.DataPass.User.name,
                email:KeyTest.DataPass.LoginUser.email ,
                password: KeyTest.DataFail.Password.lessthaneight,
                roles: KeyTest.DataPass.User.roles
            })
            expect(res.statusCode).toBe(400);
        });

        test('Post User Fail Email special characters ', async () => {
            const res = await request(server).post(KeyTest.config.User).set('Authorization', `Bearer ${token}`)
            .send(KeyTest.Null);
            expect(res.statusCode).toBe(400);
        });

        test('Post User Fail Roles User or Manger', async () => {
            await request(server).post(KeyTest.config.Auth.Register).send({
                name: KeyTest.DataPass.LoginUser.name,
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            const UserLogin = await request(server).post(KeyTest.config.Auth.Login).send({
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            tokenUser = UserLogin.body.token.access.token;
            const res = await request(server).post(KeyTest.config.User).set('Authorization', `Bearer ${UserLogin.body.token.access.token}`)
            .send(KeyTest.DataPass.User);
            expect(res.statusCode).toBe(403);
        });
    });
    describe('Get User function', () => {
        describe('GEt User All', () => {
            test('Get User All return json ',async () => {
                const res = await request(server).get(KeyTest.config.User).set('Authorization', `Bearer ${token}`);
                expect(res.type).toBe('application/json');
                expect(res.status).toBe(200);
            });
        });

        describe('GEt User ID', () => {
            test('Get User Fail wrong Id ',async () => {
                const res = await request(server).get(`${KeyTest.config.User}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`);
                expect(res.statusCode).toBe(404);
            });
            test('Path User Pass ',async () => {
                const res = await request(server).get(`${KeyTest.config.User}/${id}`).set('Authorization', `Bearer ${token}`);
                expect(res.statusCode).toBe(200);
            });
        });
    });
    describe('Path User function', () => {
        test('Path User Pass', async () => {
            const res = await request(server).patch(`${KeyTest.config.User}/${id}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.UserUpdate);
            expect(res.statusCode).toBe(200);
        });
        test('Path User Fail Email exist in DB', async () => {
            const res = await request(server).patch(`${KeyTest.config.User}/${id}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.User);
            expect(res.statusCode).toBe(400);
        });
        test('Path User Fail No login', async () => {
            const res = await request(server).patch(`${KeyTest.config.User}/${KeyTest.DataFail.ID}`).send(KeyTest.DataPass.UserUpdate);
            expect(res.statusCode).toBe(401);
        });
        test('Path User Fail Role other Admin', async () => {
            const res = await request(server).patch(`${KeyTest.config.User}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${tokenUser}`)
                .send(KeyTest.DataPass.UserUpdate);
            expect(res.statusCode).toBe(403);
        });
        test('Path User Fail wrong Id', async () => {
            const res = await request(server).patch(`${KeyTest.config.User}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.UserUpdate);
            expect(res.statusCode).toBe(404);
        });
    });
    describe('Delete User function', () =>{
        test('Delete User Pass', async () => {
            const res = await request(server).delete(`${KeyTest.config.User}/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(204);
        });
        test('Delete User wrong id', async () => {
            const res = await request(server).delete(`${KeyTest.config.User}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        });
        test('Delete User Roles other manager or user', async () => {
            const res = await request(server).delete(`${KeyTest.config.User}/${id}`).set('Authorization', `Bearer ${tokenUser}`);
            expect(res.statusCode).toBe(403);
        });
        test('Delete User No login', async () => {
            const res = await request(server).delete(`${KeyTest.config.User}/${id}`);
            expect(res.statusCode).toBe(401);
        });
    });
});