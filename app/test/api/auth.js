let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../../../server");
const db = require('../../models')
const User = db.users;
const utils = require('../../utils');

//Assertion Style
chai.should();

chai.use(chaiHttp);


describe('Auth API', () => {
    // Login
    describe("POST /auth/login", () => {
        it("Harus Mendapatkan Token", (done) => {
            const user = {
                email: "and@gmail.com",
                password: "12345"
            }
            chai.request(app)
                .post("/auth/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.token.should.not.be.empty;
                    done();
                });
        });

        it("Harus gagal email atau password salah ", (done) => {
            const user = {
                email: "andrew@gmail.com",
                password: "12345"
            }
            chai.request(app)
                .post("/auth/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

    });

    // Forgot Password
    // describe("PUT /auth/forgotpassword", () => {
    //     it("Harus Mengirimkan Email", (done) => {
    //         const user = {
    //             email: "and@gmail.com"
    //         }
    //         chai.request(app)
    //             .post("/auth/forgotpassword")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 done();
    //             });
    //     });

    // it("Harus gagal email atau password salah ", (done) => {
    //     const User = {
    //         email: "andrew@gmail.com",
    //         password: "12345"
    //     }
    //     chai.request(app)
    //         .post("/auth/logout")
    //         .send(User)
    //         .end((err, res) => {
    //             res.should.have.status(401);
    //             done();
    //         });
    // });

    // });
})