const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');
const { Map } = require('../src/models');

let token, id,tokenLocation;
let lstmap = [],location = {};
beforeAll(async () => {
    await mongoose.connect(config.getDBUri(), config.DB.CONFIGS);
    await (await Map.find({})).forEach(x => {
        lstmap.push(x._id.toString());
    });
    location = {...KeyTest.DataPass.Location,...{Location: lstmap[Math.floor(Math.random() * lstLocation.length)]}};
    const res = await request(server).post(KeyTest.config.Auth.Login).send(KeyTest.DataPass.LoginFUllRoles);
    token = res.body.token.access.token;
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
describe('TEST LOPCATION FUNCATION ',() => {
    describe('Post Location ',() => {
        test('POST Location Pass ',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send(location);
            id = res.body._id;
            expect(res.status).toEqual(201);
        });
        test('Post Location Fail data null',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send(KeyTest.DataFail.Null);
            expect(res.status).toEqual(400);
        }); 
        test('Post Location Fail Location unregistered',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send({...KeyTest.DataPass.Location,...{Location: KeyTest.DataFail.ID}});
            expect(res.status).toEqual(404);
        }); 
        test('Post Location the title exists Location in db',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send(location);
            expect(res.status).toEqual(400);
        });
        test('Post Location Fail status other Draft, Release',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send({
                status: KeyTest.DataFail.Status,
                title: KeyTest.DataPass.Location.title,
                lat: KeyTest.DataPass.Location.lat,
                lng: KeyTest.DataPass.Location.lng,
                alt: KeyTest.DataPass.Location.alt,
                type: KeyTest.DataPass.Location.type,
                Location: KeyTest.DataFail.ID
            });
            expect(res.status).toEqual(400);
        }); 
        test('Post Location Fail types other Station, Charging, Waiting',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send({
                status: KeyTest.DataFail.Status,
                title: KeyTest.DataPass.Location.title,
                lat: KeyTest.DataPass.Location.lat,
                lng: KeyTest.DataPass.Location.lng,
                alt: KeyTest.DataPass.Location.alt,
                type: KeyTest.DataFail.Status,
                Location: KeyTest.DataFail.ID
            });
            expect(res.status).toEqual(400);
        }); 
        test('Post Location Fail lat,lng or alt string exists letter',() => {
            const res = await request(server).post(KeyTest.config.Location).set('Authorization', `Bearer ${token}`)
            .send({
                status: KeyTest.DataPass.Location.status,
                title: KeyTest.DataPass.Location.title,
                lat: KeyTest.DataFail.Location.LatString,
                lng: KeyTest.DataFail.Location.LatString,
                alt: KeyTest.DataFail.Location.alt,
                type: KeyTest.DataPass.Location.type,
                Location: KeyTest.DataFail.ID
            });
            expect(res.status).toEqual(400);
        });
    });
    describe('Get Location',() => {
        test('Get Location All return json ',async () => {
            const res = await request(server).get(KeyTest.config.Location);
            expect(res.type).toBe('application/json');
        });
        test('Get Location Fail wrong Id ',async () => {
            const res = await request(server).get(`${KeyTest.config.Location}/${KeyTest.DataFail.ID}`);
            expect(res.statusCode).toBe(200);
        });
        test('Path Location Fail wrong Id ',async () => {
            const res = await request(server).get(`${KeyTest.config.Location}/${KeyTest.DataFail.ID}`);
            expect(res.statusCode).toBe(200);
        });
    });
    describe('Path Location function', () => {
        test('Path Location Pass', async () => {
            const res = await request(server).patch(`${KeyTest.config.Location}/${id}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.LocationUpdate);
            expect(res.statusCode).toBe(200);
        });
        test('Path Location Fail ', async () => {
            const res = await request(server).patch(`${KeyTest.config.Location}/${id}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.LocationUpdate);
            expect(res.statusCode).toBe(200);
        });
        // test('Path Location Fail Email exist in DB', async () => {
        //     const res = await request(server).patch(`${KeyTest.config.Location}/${id}`).set('Authorization', `Bearer ${token}`)
        //         .send(KeyTest.DataPass.Location);
        //     expect(res.statusCode).toBe(400);
        // });
        test('Path Location Fail No login', async () => {
            const res = await request(server).patch(`${KeyTest.config.Location}/${id}`).send(KeyTest.DataPass.LocationUpdate);
            expect(res.statusCode).toBe(401);
        });
        test('Path Location Fail Role other Manager', async () => {
            const res = await request(server).patch(`${KeyTest.config.Location}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${tokenLocation}`)
                .send(KeyTest.DataPass.LocationUpdate);
            expect(res.statusCode).toBe(403);
        });
        test('Path Location Fail wrong Id', async () => {
            const res = await request(server).patch(`${KeyTest.config.Location}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.LocationUpdate);
            expect(res.statusCode).toBe(404);
        });
    });
    describe('Delete Location function', () =>{
        test('Delete Location Pass', async () => {
            const res = await request(server).delete(`${KeyTest.config.Location}/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(204);
        });
        test('Delete Location wrong id', async () => {
            const res = await request(server).delete(`${KeyTest.config.Location}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        });
        test('Delete Location Roles other Admin', async () => {
            const res = await request(server).delete(`${KeyTest.config.Location}/${id}`).set('Authorization', `Bearer ${tokenLocation}`);
            expect(res.statusCode).toBe(403);
        });
        test('Delete Location No login', async () => {
            const res = await request(server).delete(`${KeyTest.config.Location}/${id}`);
            expect(res.statusCode).toBe(401);
        });
    });
});