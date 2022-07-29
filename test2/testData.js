const { faker } = require('@faker-js/faker/locale/vi');
const { Map } = require('../src/models');
var mongoose = require('mongoose');
const Ip = ['1.2.3.4.5','1234.1234','257.258.269.299','1995.-4.-5.9','A.1.2.3','1@3,5.6','1.27.2..','ipvtv'];
const status = ['Draft', 'Release'];
const roles = ["admin", "manager","user"];
const types = ['Station ', 'Charging', 'Waiting'];

const config = {
    Auth: {
        Register: '/v1/auth/register',
        Login: '/v1/auth/login',
        Logout: '/v1/auth/logout',
        RefreshToken: '/v1/auth/refresh-token',
        ForgotPassword: '/v1/auth/forgot-password',
        ResetPassword: '/v1/auth/reset-password',
        SendVerificationEmail: '/v1/auth/send-verification-email',
        VerifyEmail: '/v1/auth/verify-email',
    },
    User: '/v1/users',
    Topic: '/v1/topics',
    Maps: '/v1/maps',
    Location: '/v1/locations',
    Car: '/v1/cars',
    Account: '/v1/account/',
    AccPass: '/v1/account/password'
}
const DataPass = {
    LoginFUllRoles: {
        email: "mchemistry95@gmail.com",
        password: "Password1"
    },
    AccountUpdate:{
        name: faker.name.findName(),
        email: faker.internet.email()
    },
    PassUpdate: faker.internet.password(8, undefined, undefined,'1'),
    LoginUser: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8, undefined, undefined, '1'),
    },
    User: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8, undefined, undefined, '1'),
        roles: [
            roles[Math.floor(Math.random() * roles.length)]
        ]
    },
    UserUpdate: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8, undefined, undefined, '1'),
        roles: [
            roles[Math.floor(Math.random() * roles.length)]
        ]
    },
    Car:{
        name: faker.vehicle.vehicle(),
        ip: faker.internet.ipv4(),
        description: faker.commerce.productDescription()
    },
    CarUpdate:{
        name: faker.vehicle.vehicle(),
        ip: faker.internet.ipv4(),
        description: faker.commerce.productDescription()
    },
    Map:{
        status: status[Math.floor(Math.random() * status.length)],
        name: faker.address.city(),
        northEastBound: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        },
        southWestBound: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        }
    },
    MapLocation:{
        status: status[Math.floor(Math.random() * status.length)],
        name: faker.address.city(),
        northEastBound: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        },
        southWestBound: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        }
    },
    MapUpdate:{
        status: status[Math.floor(Math.random() * status.length)],
        name: faker.address.city(),
        northEastBound: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        },
        southWestBound: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        }
    },
    Location:{
        status: status[Math.floor(Math.random() * status.length)],
        title: 'Bến ' + Math.floor(Math.random() * 10),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        alt: Math.random(),
        type: types[Math.floor(Math.random() * types.length)]
    },
    LocationUpdate:{
        status: status[Math.floor(Math.random() * status.length)],
        title: 'Bến ' + Math.floor(Math.random() * 10),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        alt: Math.random(),
        type: types[Math.floor(Math.random() * types.length)],
        description: 'Bến '+ Math.floor(Math.random() * 10) + ' ngược'
    }
}
const DataFail = {
    ID: mongoose.Types.ObjectId().toString(),
    Emoji: faker.internet.emoji(),
    Null: null,
    ip: Ip[Math.floor(Math.random() * Ip.length)],
    Status: 'editor',
    Name: {
        SpecialCharacters: faker.name.findName() + '# $' , 
        NameNumber: faker.phone.number(),
        NameSpace: 'Tuan 123',
        NameUnicode: 'U+0048',
    },
    Password: {
        specialChars: faker.internet.password(7) + "$",
        lessthaneight: faker.internet.password(7),
        space: faker.internet.password(7) + ' ' 
    },
    Email: {
        EmailNullDomain: 'tuan123@gmail',
        EmailSpaceDomain: 'tuan123@ gmail.com',
        EmailDomainDots: 'tuan123@gmail.com.vn',
        DotsHeadEmail: '...tuan@gmail.com',
        EmailSpecialCharacters: 'tuan123#@gmail.com',
        EmailBracket: '[tuan123]@gmail.com',
    },
    Map:{
        LatString: 'lat' + faker.address.latitude(),
        LngString: 'lng' + faker.address.longitude(),
        alt: 'alt' + Math.random()
    }
}
module.exports = {
    config,
    DataPass,
    DataFail
};