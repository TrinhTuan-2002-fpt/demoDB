const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');
const { Map } = require('../src/models');

let token, id;
beforeAll(async () => {
    await mongoose.connect(config.getDBUri(), config.DB.CONFIGS);
    const res = await request(server).post(KeyTest.config.Auth.Login).send(KeyTest.DataPass.LoginFUllRoles);
    token = res.body.token.access.token;
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

describe('TEST APPLICATION FUNCATION', () =>{
    describe('Post Application', () =>{
        test('Post Application Pass ',() => {
            const res = await request(server).post(KeyTest.config.Application).set('Authorization',`Bearer ${token}`)
            .send(KeyTest.DataPass.Application);
            expect(res.statusCode).toEqual(201);
        });
        test('Post Application Fail Name character ',() => {
            const res = await request(server).post(KeyTest.config.Application).set('Authorization',`Bearer ${token}`)
            .send({
                name: KeyTest.DataFail.Name.SpecialCharacters,
                weatherKey: KeyTest.DataPass.Application.weatherKey
            });
            expect(res.statusCode).toEqual(400);
        });
        test('Post Application Pass ',() => {
            const res = await request(server).post(KeyTest.config.Application).set('Authorization',`Bearer ${token}`)
            .send(KeyTest.DataPass.Application);
            expect(res.statusCode).toEqual(201);
        });
        test('Post Application Pass ',() => {
            const res = await request(server).post(KeyTest.config.Application).set('Authorization',`Bearer ${token}`)
            .send(KeyTest.DataPass.Application);
            expect(res.statusCode).toEqual(201);
        });
    });
    describe('Get Application', () =>{
        test('Get Application Pass ',() => {

        });
    });
    describe('Path Application', () =>{
        test('Post Application Pass ',() => {

        });
    });
    describe('Post Application', () =>{
        test('Post Application Pass ',() => {

        });
    });
});