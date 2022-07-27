const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');

let token, id,tokenMap;

beforeAll(async () => {
    await mongoose.connect(config.getDBUri(), config.DB.CONFIGS);
    const res = await request(server).post(KeyTest.config.Auth.Login).send(KeyTest.DataPass.LoginFUllRoles);
    token = res.body.token.access.token;
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
describe('TEST MAP FUNCTION', () => {
    describe('Post Map function', () => {
        describe('Post Map Fail', () => {
            test('Post Map Null',async () => {
                const res = await request(server).post(KeyTest.config.Maps).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.Null);
                expect(res.statusCode).toBe(400);
            });

            test('Post Map Role User or Admin',async () => {
                await request(server).post(KeyTest.config.Auth.Register).send(KeyTest.DataPass.LoginUser);
                const LoginUser = await request(server).post(KeyTest.config.Auth.Login).send({
                    email: KeyTest.DataPass.LoginUser.email,
                    password: KeyTest.DataPass.LoginUser.password
                });
                const res = await request(server).post(KeyTest.config.Maps).set('Authorization', `Bearer ${LoginUser.body.token.access.token}`)
                .send(KeyTest.DataPass.Map);
                expect(res.statusCode).toBe(403);
            });

            test('Post Map Login null',async () => {
                const res = await request(server).post(KeyTest.config.Maps).send(KeyTest.Null);
                expect(res.statusCode).toBe(401);
            });

            test('Post Map wrong status',async () => {
                const res = await request(server).post(KeyTest.config.Maps).set('Authorization', `Bearer ${token}`)
                .send({
                    status: KeyTest.DataFail.Status,
                    name: KeyTest.DataPass.Map.name,
                    northEastBound: KeyTest.DataPass.Map.northEastBound,
                    southWestBound: KeyTest.DataPass.Map.southWestBound 
                });
                expect(res.statusCode).toBe(400);
            });

            test('Post Map Fail Name Full number', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send({
                    status: KeyTest.DataFail.Status,
                    name: KeyTest.DataFail.Name.NameNumber,
                    northEastBound: KeyTest.DataPass.Map.northEastBound,
                    southWestBound: KeyTest.DataPass.Map.southWestBound 
                });
                expect(res.statusCode).toBe(400);
            });

            test('Post Map Fail Name contain unicode', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send({
                    status: KeyTest.DataFail.Status,
                    name: KeyTest.DataFail.Name.NameUnicode,
                    northEastBound: KeyTest.DataPass.Map.northEastBound,
                    southWestBound: KeyTest.DataPass.Map.southWestBound 
                });
                expect(res.statusCode).toBe(400);
            });

            test('Post Map Fail Lat or Lng Null', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send({
                    status: KeyTest.DataFail.Status,
                    name: KeyTest.DataFail.Name.NameUnicode,
                    northEastBound: KeyTest.DataFail.Null,
                    southWestBound: KeyTest.DataPass.Map.southWestBound 
                });
                expect(res.statusCode).toBe(400);
            });

            test('Post Map Fail northEastBound Lat or Lng contain string', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send({
                    status: KeyTest.DataFail.Status,
                    name: KeyTest.DataFail.Name.NameUnicode,
                    northEastBound: {
                        lat: KeyTest.DataFail.Map.LatString,
                        lng: KeyTest.DataFail.Map.LngString
                    },
                    southWestBound: KeyTest.DataPass.Map.southWestBound 
                });
                expect(res.statusCode).toBe(400);
            });

            test('Post Map Fail southWestBound Lat or Lng contain string', async () => {
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send({
                    status: KeyTest.DataFail.Status,
                    name: KeyTest.DataFail.Name.NameUnicode,
                    northEastBound: KeyTest.DataPass.Map.southWestBound,
                    southWestBound:  {
                        lat: KeyTest.DataFail.Map.LatString,
                        lng: KeyTest.DataFail.Map.LngString
                    }
                });
                expect(res.statusCode).toBe(400);
            });
            
            test('Post Map Fail Map exist in DB', async () => {
                await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.Map);
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.Map);
                expect(res.statusCode).toBe(400);
            });
            test('Post Car Role map',async () => {
                await request(server).post(KeyTest.config.Car).send({
                    name: KeyTest.DataPass.LoginUser.name,
                    email: KeyTest.DataPass.LoginUser.email,
                    password: KeyTest.DataPass.LoginUser.password
                });
                const UserLogin = await request(server).post(KeyTest.config.Auth.Login).send({
                    email: KeyTest.DataPass.LoginUser.email,
                    password: KeyTest.DataPass.LoginUser.password
                });
                tokenMap = UserLogin.body.token.access.token;
                const res = await request(server).post(KeyTest.config.Maps).set('Authorization', `Bearer ${UserLogin.body.token.access.token}`)
                .send(KeyTest.DataPass.Map);
                expect(res.statusCode).toBe(403);
            });
        });
        describe('Post Map Pass', () => {
            test('Post Map', async() => {
                const res = await request(server).post(KeyTest.config.Auth.Register).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.Map);
                expect(res.statusCode).toBe(201);
            });
        });
    });
    describe('Get Map function', async() => {
        describe('GEt Map All', () => {
            test('Get Map All return json ',async () => {
                const res = await request(server).get(KeyTest.config.Maps);
                expect(res.type).toBe('application/json');
            });
        });

        describe('GEt Map ID', () => {
            describe('GEt Map ID Fail', () => {
                test('Get Map Fail wrong Id ',async () => {
                    const res = await request(server).get(`${KeyTest.config.Maps}/${KeyTest.DataFail.ID}`);
                    expect(res.statusCode).toBe(200);
                });
            });
            describe('GEt Map ID Pass', () => {
                test('Path Map Fail wrong Id ',async () => {
                    const res = await request(server).get(`${KeyTest.config.Maps}/${KeyTest.DataFail.ID}`);
                    expect(res.statusCode).toBe(200);
                });
            });
        });
    });
    describe('Path Map function', () => {
        test('Path Map Pass', async () => {
            const res = await request(server).patch(`${KeyTest.config.Maps}/${id}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.MapUpdate);
            expect(res.statusCode).toBe(200);
        });
        describe('Path Fail',() =>{
            test('Path Map Fail ', async () => {
                const res = await request(server).patch(`${KeyTest.config.Maps}/${id}`).set('Authorization', `Bearer ${token}`)
                    .send(KeyTest.DataPass.MapUpdate);
                expect(res.statusCode).toBe(200);
            });
            // test('Path Map Fail Email exist in DB', async () => {
            //     const res = await request(server).patch(`${KeyTest.config.Maps}/${id}`).set('Authorization', `Bearer ${token}`)
            //         .send(KeyTest.DataPass.Map);
            //     expect(res.statusCode).toBe(400);
            // });
            test('Path Map Fail No login', async () => {
                const res = await request(server).patch(`${KeyTest.config.Maps}/${KeyTest.DataFail.ID}`).send(KeyTest.DataPass.MapUpdate);
                expect(res.statusCode).toBe(404);
            });
            test('Path Map Fail Role other Manager', async () => {
                const res = await request(server).patch(`${KeyTest.config.Maps}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${tokenMap}`)
                    .send(KeyTest.DataPass.MapUpdate);
                expect(res.statusCode).toBe(403);
            });
            test('Path Map Fail wrong Id', async () => {
                const res = await request(server).patch(`${KeyTest.config.Maps}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`)
                    .send(KeyTest.DataPass.MapUpdate);
                expect(res.statusCode).toBe(404);
            });
        });
    });
    describe('Delete Map function', () =>{
        test('Delete Map Pass', async () => {
            const res = await request(server).delete(`${KeyTest.config.Maps}/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(204);
        });
        test('Delete Map wrong id', async () => {
            const res = await request(server).delete(`${KeyTest.config.Maps}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        });
        test('Delete Map Roles other Admin', async () => {
            const res = await request(server).delete(`${KeyTest.config.Maps}/${id}`).set('Authorization', `Bearer ${tokenMap}`);
            expect(res.statusCode).toBe(403);
        });
        test('Delete Map No login', async () => {
            const res = await request(server).delete(`${KeyTest.config.Maps}/${id}`);
            expect(res.statusCode).toBe(401);
        });
    });
})