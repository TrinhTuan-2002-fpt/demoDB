const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');

let token,id,managertoken;
// Connects to database before running tests
beforeAll(async () => {
    await mongoose.connect(config.getDBUri(), config.DB.CONFIGS);
    console.log(KeyTest.DataPass); //
    await request(server).post(KeyTest.config.Auth.Register).send(KeyTest.DataPass.LoginUser);
    const res = await request(server).post(KeyTest.config.Auth.Login).send({
        email: KeyTest.DataPass.LoginUser.email,
        password: KeyTest.DataPass.LoginUser.password
    });
    console.log(res.body);
    token = res.body.token.access.token;
    id = res.body.user._id;
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  
describe('ACCOUNT TEST FUNCTION', () => {
    describe('Get Account ', () => {
        test('Get Account fail Role Admin or Manager',async () => {
            const admin = await request(server).post(KeyTest.config.Auth.Login).send(KeyTest.DataPass.LoginFUllRoles);
            const postuser = await request(server).post(KeyTest.config.User).set('Authorization', `Bearer ${admin.body.token.access.token}`).send(KeyTest.DataPass.User);
            console.log(KeyTest.DataPass.User);
            console.log(postuser.body);
            const LoginUser = await request(server).post(KeyTest.config.Auth.Login).send({
                email: KeyTest.DataPass.User.email,
                password: KeyTest.DataPass.User.password
            });
            console.log(LoginUser.body);
            managertoken = LoginUser.body.token.access.token;
            const res = await request(server).get(KeyTest.config.Account).set('Authorization', `Bearer ${LoginUser.body.token.access.token}`);
            expect(res.statusCode).toBe(403);
        });
        test('Get Account fail Null token', async () => {
            const res = await request(server).get(KeyTest.config.Account);
            expect(res.statusCode).toBe(401);
        });
        test('Get Account return json ',async () => {
            const res = await request(server).get(KeyTest.config.Account).set('Authorization', `Bearer ${token}`);
            expect(res.type).toBe('application/json');
            expect(res.statusCode).toBe(200);
        });
    });
        describe('Path Account',() => {
            test('Path Account Fail Role wrong ',async () => {
                const res = await request(server).patch(KeyTest.config.Account).set('Authorization', `Bearer ${managertoken}`)
                .send(KeyTest.DataPass.AccountUpdate);
                expect(res.statusCode).toBe(403);
            }); 
            test('Path Account fail Null token', async () => {
                const res = await request(server).patch(KeyTest.config.Account);
                expect(res.statusCode).toBe(401);
            });
            test('Path Account fail Name special character', async () => {
                const res = await request(server).patch(KeyTest.config.Account).set('Authorization', `Bearer ${token}`)
                .send({
                    name: KeyTest.DataFail.Name.SpecialCharacters,
                    email: KeyTest.DataPass.AccountUpdate.email
                });
                expect(res.statusCode).toBe(400);
            });
            test('Path Account fail email exist in DB', async () => {
                const res = await request(server).patch(KeyTest.config.Account).set('Authorization', `Bearer ${token}`)
                .send({
                    name: KeyTest.DataPass.AccountUpdate.name,
                    email: KeyTest.DataPass.LoginUser.email
                });
                expect(res.statusCode).toBe(400);
            });
            
            test('Path Account Password fail', async () => {

            });
            test('Path Account Password Fail Role wrong ',async () => {
                const res = await request(server).patch(KeyTest.config.AccPass).set('Authorization', `Bearer ${managertoken}`)
                .send(KeyTest.DataPass.AccountUpdate);
                expect(res.statusCode).toBe(403);
            }); 
            test('Path Account Password fail Null token', async () => {
                const res = await request(server).patch(KeyTest.config.AccPass);
                expect(res.statusCode).toBe(401);
            });
            test('Path Account Password fail currentPassword wrong', async () => {
                const res = await request(server).patch(KeyTest.config.AccPass).set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: KeyTest.DataPass.PassUpdate,
                    newPassword: KeyTest.DataPass.PassUpdate
                });
                expect(res.statusCode).toBe(401);
            });
            test('Path Account Password fail newPassword wrong', async () => {
                const res = await request(server).patch(KeyTest.config.AccPass).set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: KeyTest.DataPass.PassUpdate,
                    newPassword: KeyTest.DataFail.Password.lessthaneight
                });
                expect(res.statusCode).toBe(400);
            });
            test('Path Account Pass ',async () => {
                const res = await request(server).patch(KeyTest.config.Account).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.AccountUpdate);
                expect(res.statusCode).toBe(200);
            }); 
            test('Path Account Password Pass ',async () => {
                const res = await request(server).patch(KeyTest.config.AccPass).set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: KeyTest.DataPass.LoginUser.password,
                    newPassword: KeyTest.DataPass.PassUpdate
                });
                expect(res.statusCode).toBe(204);
            }); 
            test('delete user ',async () => {
                const res = await request(server).delete(`${KeyTest.config.User}/${id}`).set('Authorization', `Bearer ${token}`);
                expect(res.statusCode).toBe(204);
            }); 
        });
})