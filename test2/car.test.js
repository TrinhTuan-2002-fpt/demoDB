const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../src/app');
const config = require('../src/config/config');
const KeyTest = require('./testData');

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

  describe('TEST CAR FUNCTION', () => {
    describe('Post Car function', () => {
        describe('Post Car Pass', () => {
            test('Post Car',async () => {
                const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.Car);
                id = res.body._id;
                expect(res.statusCode).toBe(201);
            });
        });
        describe('Post Car Fail', () => {
            test('Post Car Null',async () => {
                const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.Null);
                expect(res.statusCode).toBe(400);
            });

            // test('Post Car Role user',async () => {
            //     await request(server).post(KeyTest.config.Car).send({
            //         name: KeyTest.DataPass.LoginUser.name,
            //         email: KeyTest.DataPass.LoginUser.email,
            //         password: KeyTest.DataPass.LoginUser.password
            //     });
            //     const UserLogin = await request(server).post(KeyTest.config.Auth.Login).send({
            //         email: KeyTest.DataPass.LoginUser.email,
            //         password: KeyTest.DataPass.LoginUser.password
            //     });
            //     const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${UserLogin.body.token.access.token}`)
            //     .send(KeyTest.DataPass.User);
            //     expect(res.statusCode).toBe(403);
            // });
            // test('Post Car Role Admin',async () => {
            //         const UserLogin = await request(server).post(KeyTest.config.Auth.Login).send(KeyTest.DataPass.LoginAdmin);
            //         console.log(UserLogin.body.token.access.token);
            //     const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${UserLogin.body.token.access.token}`)
            //     .send(KeyTest.DataPass.User);
            //     expect(res.statusCode).toBe(403);
            // });
            // test('Post Car Login null',async () => {
            //     const res = await request(server).post(KeyTest.config.Car).send(KeyTest.Null);
            //     expect(res.statusCode).toBe(401);
            // });

            test('Post Car wrong ip',async () => {
                const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
                .send({
                    name: KeyTest.DataPass.Car.name,
                    ip: KeyTest.DataFail.ip,
                    description: KeyTest.DataPass.Car.description
                });
                expect(res.statusCode).toBe(400);
            });

            // test('Post Car Fail Name Full number', async () => {
            //     const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
            //     .send({
            //         name: KeyTest.DataFail.Name.NameNumber,
            //         ip: KeyTest.DataFail.ip,
            //         description: KeyTest.DataPass.Car.description
            //     });
            //     expect(res.statusCode).toBe(400);
            // });

            // test('Post Car Fail Name contain unicode', async () => {
            //     const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
            //     .send({
            //         name: KeyTest.DataFail.Name.NameUnicode,
            //         ip: KeyTest.DataFail.ip,
            //         description: KeyTest.DataPass.Car.description
            //     });
            //     expect(res.statusCode).toBe(400);
            // });

            // test('Post Car Fail Name  SpecialCharacters', async () => {
            //     const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
            //     .send({
            //         name: KeyTest.DataFail.Name.SpecialCharacters,
            //         ip: KeyTest.DataFail.ip,
            //         description: KeyTest.DataPass.Car.description
            //     });
            //     expect(res.statusCode).toBe(400);
            // });
            
            // test('Post Car Fail Car exist in DB', async () => {
            //     await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
            //     .send(KeyTest.DataPass.Car);
            //     const res = await request(server).post(KeyTest.config.Car).set('Authorization', `Bearer ${token}`)
            //     .send(KeyTest.DataPass.Car);
            //     expect(res.statusCode).toBe(400);
            // });
        });
    });
    describe('GEt Car function', () => {
        describe('GEt Car All', () => {
            test('Get Car All return json ',async () => {
                const res = await request(server).get(KeyTest.config.Car);
                expect(res.type).toBe('application/json');
            });
        });

        describe('GEt Car ID', () => {
            describe('GEt Car ID Fail', () => {
                test('Get Car Fail wrong Id ',async () => {
                    const res = await request(server).get(`${KeyTest.config.Car}/${KeyTest.DataFail.ID}`);
                    expect(res.statusCode).toBe(200);
                });
            });
            describe('GEt Car ID Pass', () => {
                test('Path Car Fail wrong Id ',async () => {
                    const res = await request(server).get(`${KeyTest.config.Car}/${KeyTest.DataFail.ID}`);
                    expect(res.statusCode).toBe(200);
                });
            });
        });
    });
    describe('Path Car function', () => {
        describe('Path Car Pass', () => {
            test('Path Car ',async () => {
                const res = await request(server).patch(`${KeyTest.config.Car}/${id}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.CarUpdate);
                expect(res.statusCode).toBe(200);
            });
        });
        describe('Path Car Fail', () => {
            test('Path Car Fail wrong Id ',async () => {
                const res = await request(server).patch(`${KeyTest.config.Car}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`)
                .send(KeyTest.DataPass.CarUpdate);
                expect(res.statusCode).toBe(400);
            });
            // test('Path Car Fail not login',async () => {
            //     const res = await request(server).get(`${KeyTest.config.Car}/${KeyTest.DataFail.ID}`);
            //     expect(res.statusCode).toBe(401);
            // });
            // test('Path Car Fail Name already taken ',async () => {
            //     const res = await request(server).get(`${KeyTest.config.Car}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`)
            //     .send(KeyTest.DataPass.Car);
            //     expect(res.statusCode).toBe(400);
            // });
        });
    });
    describe('Delete Car function', () => {
        test('Delete Car Fail wrong Id ',async () => {
            const res = await request(server).delete(`${KeyTest.config.Car}/${KeyTest.DataFail.ID}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        });
        test('Delete Car Pass',async () => {
            const res = await request(server).delete(`${KeyTest.config.Car}/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(204);
        });
    });
})