const { faker } = require('@faker-js/faker/locale/vi');
const { server } = require('../src/app');
const KeyTest = require('./testData');


// const bigList = [...Array(3)].map(() => ([
//      faker.name.findName(), faker.internet.email(),
//   ]));
// const bigList = [];
// console.log(bigList);

// console.log(test.config);
// describe.each(bigList)('post(%s, %s)', (name,email) => {
//     test(`done ${name}`, () => {
//         expect(name).toBe(name);
//     });
// });
let lstLocation = [];

const data = {
    vehicle: faker.vehicle.vehicle(),
    nameMen: faker.name.findName(undefined,undefined,'male'),
    nameWomen: faker.name.findName(undefined,undefined,'female'),
    address: {
        address: faker.address.streetAddress(true),
        Building: faker.address.buildingNumber(),
        //streetName: faker.address.streetName(),
        Cardinal: faker.address.cardinalDirection(),
        City: faker.address.city() ,
        County: faker.address.county(),
        Direction:faker.address.direction(),
        Latitude: faker.address.latitude(),
        Longitude: 'sh' + faker.address.latitude(),
        //cố định hoặc thay đổi
        GPS: faker.address.nearbyGPSCoordinate([20.96127150746271, 105.74746976590164],0.55),
        img: faker.image.animals(),
        avt: faker.image.avatar(),
        cityimg: faker.image.city(),
        people: faker.image.people(),
    },User: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
        //phone: faker.phone.phoneNumber('+84 ### ### ###'),
        phone1: faker.phone.number()
    },User123: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8, undefined, undefined, '1')
    },
    UserUpdate: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8, undefined, undefined, '1')
    }
};
const data1 = {  
  LoginUser: {
      email: faker.internet.email(),
      password: faker.internet.password(8, undefined, undefined, '1'),
  },
  User: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(8, undefined, undefined, '1'),
      
  },
  UserUpdate: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(8, undefined, undefined, '1'),
      
  }
}

describe('test map',() => {
    test('adds 1 + 2 to equal 3',async () => {
        const res = await request(server).get(KeyTest.config.Location);
        res.body.forEach(x => {
            lstLocation.push(x._id);
        });
        console.log(lstLocation);
        expect(1+2).toBe(3);
      });
})

