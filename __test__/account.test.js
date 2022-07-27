const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');

let token,id;
let lstLocation = [];
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
  
describe('ACCOUNT TEST FUNCTION', () => {
    describe('Get Account ', () => {
        test('Get Account fail Role Admin or Manager',async () => {
            await request(server).post(KeyTest.config.User).send(KeyTest.DataPass.LoginUser);
            const LoginUser = await request(server).post(KeyTest.config.Auth.Login).send({
                email: KeyTest.DataPass.LoginUser.email,
                password: KeyTest.DataPass.LoginUser.password
            });
            const res = await request(server).get(KeyTest.config.Account).set('Authorization', `Bearer ${LoginUser.body.token.access.token}`);
            expect(res.statusCode).toBe(403);
        });
        test('Get Account fail Null token', async () => {

        });
        test('Get Account fail Null token', async () => {

        });
        
        test('Get Account return json ',async () => {
            const res = await request(server).get(KeyTest.config.Account).set('Authorization', `Bearer ${token}`);
            expect(res.type).toBe('application/json');
            expect(res.statusCode).toBe(200);
        });
    });
    // describe('',() => {
    //     describe('',() => {
    //         test('',() => {

    //         }); 
    //         test('',() => {

    //         }); 
    //     });
    //     describe('',() => {
    //         test('',() => {

    //         }); 
    //         test('',() => {

    //         }); 
    //     });
    // });
    // describe('',() => {
    //     describe('',() => {
    //         test('',() => {

    //         }); 
    //     });
    //     describe('',() => {
    //         test('',() => {

    //         }); 
    //         test('',() => {

    //         }); 
    //     });
    // });
})