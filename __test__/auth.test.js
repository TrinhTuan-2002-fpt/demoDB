const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');

let token,tokenacc;

beforeAll(async () => {
    await mongoose.connect(config.getDBUri(), config.DB.CONFIGS);
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

describe('TEST AUTH FUNCTION  ', () => {
    describe('TEST REGISTER FUNCTION', () => {
        test('Register Fail Email,Name or Password null', async () => {
            const res = await request(server).post(KeyTest.config.Auth.Register).send(KeyTest.DataFail.Null);
            expect(res.statusCode).toBe(400);
        });

        test('Register Fail Name Full number', async () => {
            const res = await request(server).post(KeyTest.config.Auth.Register).send({
                name: KeyTest.DataFail.Name.NameNumber,
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            expect(res.statusCode).toBe(400);
        });

        test('Register Fail Name contain unicode', async () => {
            const res = await request(server).post(KeyTest.config.Auth.Register).send({
                name: KeyTest.DataFail.Name.NameUnicode,
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            expect(res.statusCode).toBe(400);
        });

        test('Register Pass ', async () => {
            const res = await request(server).post(KeyTest.config.Auth.Register).send(KeyTest.DataPass.LoginUser);
            expect(res.statusCode).toBe(201);
        });

        test('Register Fail Name email exist in Db', async () => {
            const res = await request(server).post(KeyTest.config.Auth.Register).send({
                name: KeyTest.DataPass.LoginUser.name,
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            expect(res.statusCode).toBe(400);
        });

        test('Register Fail Email already exist ', async () => {
            const res = await request(server).post(KeyTest.config.Auth.Register).send({
                name: KeyTest.DataPass.LoginUser.name,
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe('TEST LOGIN FUNCTION  ', () => {
        describe('LOGIN Fail', () => {   
            test('login Fail Email or Password null',async () => {
                const res = await request(server).post(KeyTest.config.Auth.Login).send({
                    email: KeyTest.DataPass.LoginUser.email,
                    password: KeyTest.DataFail.Null
                });
                expect(res.statusCode).toBe(400);
            });
        
            test('login Fail Email wrong format ', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Login).send({
                    email: KeyTest.DataFail.Email.EmailNullDomain,
                    password: KeyTest.DataPass.User.password
                });
                expect(res.statusCode).toBe(401);
            });
            
            test('login Fail Email unregistered ', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Login).send({
                    email: KeyTest.DataPass.User.email,
                    password: KeyTest.DataPass.User.password 
                });
                expect(res.statusCode).toBe(401);
            });
        });

        describe(('login Pass'), () => {
            test('login Pass User', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Login).send({
                    email: KeyTest.DataPass.LoginUser.email,
                    password: KeyTest.DataPass.LoginUser.password
                });
                tokenacc = res.body.token.access.token;
                token = res.body.token.refresh.token;
                console.log(token);
                expect(res.statusCode).toBe(200);
            });
        })
    });
    describe('TEST LOGOUT FUNCTION', () => {
        describe('Logout Fail', () => {
            test('logout Fail refreshToken null', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Logout).send({
                    refreshToken: KeyTest.DataFail.Null
                });
                expect(res.statusCode).toBe(400);
            });
            test('logout Fail refreshToken wrong', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Logout).send({
                    refreshToken: tokenacc
                });
                expect(res.statusCode).toBe(404);
            });
        });
        
        describe('Logout Pass', () => {
            test('logout Pass', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Logout).send({
                    refreshToken: token
                });
                expect(res.statusCode).toBe(204);
            });
        });
    });
});