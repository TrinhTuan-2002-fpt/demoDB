const { faker } = require('@faker-js/faker/locale/vi');
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
    Account: '/v1/account/'
}
const DataPass = {
    LoginFUllRoles: {
        email: "mchemistry95@gmail.com",
        password: "Password1"
    },
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
    }
}
const DataFail = {
    ID: mongoose.Types.ObjectId().toString(),
    Emoji: '🥲',
    Null: null,
    ip: Ip[Math.floor(Math.random() * Ip.length)],
    Status: 'editor',
    Name: {
        SpecialCharacters: faker.name.findName() + '# $' , 
        NameNumber: faker.phone.number(),
        NameSpace: 'Tuan 123',
        NameUnicode: 'U+0048',
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
        status: 'editor',
        LatString: 'sh' + faker.address.latitude(),
        LngString: 'sh' + faker.address.longitude(),
    }
}

module.exports = {
    config,
    DataPass,
    DataFail
};