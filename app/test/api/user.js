let chai = require("chai");
let chaiHttp = require("chai-http");
const app = require("../../../server");
const request = require("supertest")(app);
const db = require('../../models')
const User = db.users;
// const utils = require('../../utils');

//Assertion Style
chai.should();

chai.use(chaiHttp);

const defaultUser = { "email": "test@gmail.com", "password": "test", "role": "bpba" };

const createUser = async () => {
    const UserModel = new User(defaultUser);
    await UserModel.save();
};

const getDefaultUser = async () => {
    let users = await User.findAll({ where: { "email": defaultUser.email } });
    if (users.length === 0) {
        await createUser();
        return getDefaultUser();
    } else {
        return users[0];
    }
};

const loginWithDefaultUser = async () => {
    let users = await getDefaultUser();
    return request.post("/auth/login")
        .send({ "email": defaultUser.email, "password": defaultUser.password })
        .expect(200);
};

describe('User API BPBA', () => {
    // Create PCU
    describe("CRUD", () => {
        const user = {
            email: "wkwkwkw@gmail.com",
            password: "12345",
            nama: "andrew",
            alamat: "Bekasi",
            no_hp: "09990000",
            role: "pcu",
            status: "enable",
            managed_by: "Udin"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Menenyimpan data PCU", (done) => {
            chai.request(app)
                .post("/bpba/admin/add/pcu")
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("Harus gagal email sudah ada ", (done) => {
            const data = {
                email: "and@gmail.com",
                password: "12345",
                nama: "andrew",
                alamat: "Bekasi",
                no_hp: "09990000",
                role: "pcu",
                status: "enable",
                assist_by: "Udin"
            }
            chai.request(app)
                .post("bpba/admin/add/pcu")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });

    });

    // create PBA
    describe("POST /bpba/admin/add/pba", () => {
        const user = {
            email: "b@gmail.com",
            password: "12345",
            nama: "andrew",
            alamat: "Bekasi",
            no_hp: "09990000",
            role: "pba",
            status: "enable",
            assist_by: "Udin"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;
        })
        it("Harus Menenyimpan data PBA", (done) => {
            chai.request(app)
                .post("/bpba/admin/add/pba")
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("Harus gagal email sudah ada ", (done) => {
            const data = {
                email: "a@gmail.com",
                password: "12345",
                nama: "andrew",
                alamat: "Bekasi",
                no_hp: "09990000",
                role: "pba",
                status: "enable",
                managed_by: "Udin"
            }
            chai.request(app)
                .post("bpba/admin/add/pba")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });

    });

    // create PBAM
    describe("POST /bpba/admin/add/pbam", () => {
        const user = {
            email: "a@gmail.com",
            password: "12345",
            nama: "andrew",
            alamat: "Bekasi",
            no_hp: "09990000",
            role: "pbam",
            status: "enable",
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Menenyimpan data PBAM", (done) => {
            chai.request(app)
                .post("/bpba/admin/add/pbam")
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("Harus gagal email sudah ada ", (done) => {
            const data = {
                email: "and@gmail.com",
                password: "12345",
                nama: "andrew",
                alamat: "Bekasi",
                no_hp: "09990000",
                role: "pbam",
                status: "enable",
            }
            chai.request(app)
                .post("bpba/admin/add/pbam")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });

    });

    // GET User per Role
    describe("GET /bpba/admin/find-by-role/:role", () => {
        const user = {
            role: "pcu"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Mengambil data User berdasarkan role", (done) => {
            chai.request(app)
                .get("/bpba/admin/find-by-role/" + user.role)
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("Harus gagal mengambil data ", (done) => {
            const data = {
                role: "admin"
            }
            chai.request(app)
                .post("/bpba/admin/find-by-role/" + data.role)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });

    // GET User By Name
    describe("GET /bpba/admin/find-by-name/:name", () => {
        const user = {
            nama: "and"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Mengambil data User berdasarkan nama", (done) => {
            chai.request(app)
                .get("/bpba/admin/find-by-name/" + user.nama)
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("Harus gagal mengambil data ", (done) => {
            const data = {
                nama: "admin"
            }
            chai.request(app)
                .post("/bpba/admin/find-by-name/" + data.nama)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });

    // GET User By Email
    describe("GET /bpba/admin/find-by-email/:email", () => {
        const user = {
            email: "and@gmail.com"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Mengambil data User berdasarkan email", (done) => {
            chai.request(app)
                .get("/bpba/admin/find-by-email/" + user.email)
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("Harus gagal mengambil data ", (done) => {
            const data = {
                email: "admin"
            }
            chai.request(app)
                .post("/bpba/admin/find-by-email/" + data.email)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });

    // Update User 
    describe("PUT /bpba/admin/update", () => {
        // const EMAIL = "and@gmail.com"
        const user = {
            nama: "andrew",
            alamat: "Bekasi",
            no_hp: "09990000",
            email: "and@gmail.com"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Memperbarui data User ", (done) => {
            chai.request(app)
                .get("/bpba/admin/find-by-email/" + user.email)
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    chai.request(app)
                        .put("/bpba/admin/update")
                        .set("Authorization", `Bearer ${token}`)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(200);
                        })
                    // res.body.should.have.property('email').eql();
                    done();
                });
        });

        it("Harus gagal Memperbarui data ", (done) => {
            const ID = 4
            const data = {
                nama: "andrew",
                alamat: "Bekasi",
                no_hp: "09990000",
            }
            chai.request(app)
                .put("/bpba/admin/update/" + ID)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });

    // Update Status User 
    describe("PUT /bpba/admin/status-change", () => {
        // const EMAIL = "and@gmail.com"
        const user = {
            status: "disable",
            email: "and@gmail.com"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Memperbarui status User ", (done) => {
            chai.request(app)
                .get("/bpba/admin/find-by-email/" + user.email)
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    chai.request(app)
                        .put("/bpba/admin/status-change")
                        .set("Authorization", `Bearer ${token}`)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(200);
                        })
                    done();
                });
        });

        it("Harus gagal Memperbarui status user ", (done) => {
            const ID = 4
            const data = {
                status: "disable"
            }
            chai.request(app)
                .put("/bpba/admin/update/" + ID)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });

    // set pbam dari pba
    // describe("PUT /bpba/admin/set-pbam-dari-pba", () => {
    //     // const EMAIL = "and@gmail.com"
    //     const user = {
    //         id: 3,
    //         managed_by: "BU@gmail.com",
    //         email: "cut@gmail.com",
    //         role: "pba",
    //         status: "enable"
    //     }
    //     before(async () => {
    //         //get token
    //         let resToken = await loginWithDefaultUser();
    //         token = resToken.body.token;

    //     })
    //     it("Harus Menset status pba dari pbam ", (done) => {
    //         chai.request(app)
    //             .get("/bpba/admin/list-user/" + user.id)
    //             .set("Authorization", `Bearer ${token}`)
    //             .send(user)
    //             .end((err, res) => {
    //                 chai.request(app)
    //                     .put("/bpba/admin/set-pbam-dari-pba")
    //                     .set("Authorization", `Bearer ${token}`)
    //                     .send(user)
    //                     .end((err, res) => {
    //                         res.should.have.status(200);
    //                     })
    //                 done();
    //             });
    //     });
    //     it("Harus gagal set pba dari pbam ", (done) => {
    //         const data = {
    //             role: "pcu",
    //             status: "enable",
    //             email: "and@gmail.com"
    //         }
    //         chai.request(app)
    //             .put("/bpba/admin/set-pbam-dari-pba")
    //             .set("Authorization", `Bearer ${token}`)
    //             .send(data)
    //             .end((err, res) => {
    //                 res.should.have.status(500);
    //             })
    //         done();
    //     });
    // });

    // set pba dari pcu
    describe("PUT /admin/set-pcu-dari-pba/:id", () => {
        const ID = 1
        const user = {
            assisted_by: "cut@gmail.com",
            role: "pcu",
            status: "enable"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Menset PCU dari PBA ", (done) => {
            chai.request(app)
                .put("/bpba/admin/set-pcu-dari-pba/" + ID)
                .set("Authorization", `Bearer ${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it("Harus gagal set pcu dari pba ", (done) => {
            const ID = 2
            const data = {
                role: "pba",
                status: "enable"
            }
            chai.request(app)
                .put("/bpba/admin/update/" + ID)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    })

    // GET hari libur
    describe("PUT bpba/schedule/holiday", () => {
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Mengambil data libur ", (done) => {
            chai.request(app)
                .get("/bpba/schedule/holiday")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        it("Harus gagal mengambil data libur ", (done) => {
            chai.request(app)
                .put("/bpba/schedule/holidays")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    })

    // create hari libur
    describe("POST /schedule/holiday/add", () => {
        const d = Date.now()
        const libur = {
            tanggal_mulai: d,
            tanggal_selesai: d,
            Keterangan: "Libur Nasional"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Menyimpan Jadwal Libur ", (done) => {
            chai.request(app)
                .post("/bpba/schedule/holiday/add")
                .set("Authorization", `Bearer ${token}`)
                .send(libur)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it("Harus gagal Menyimpan Jadwal Libur ", (done) => {
            const libur = {
                // tanggal_mulai: ,
                // tanggal_selesai: ,
                Keterangan: "Libur Nasional"
            }
            chai.request(app)
                .post("/bpba/schedule/holiday/adds")
                .set("Authorization", `Bearer ${token}`)
                .send(libur)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    })

    // update hari libur
    describe("PUT /schedule/holiday/edit", () => {
        const d = Date.now()
        const libur = {
            id: 1,
            tanggal_mulai: d,
            tanggal_selesai: d,
            Keterangan: "Libur Nasional"
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Mengubah Jadwal Libur ", (done) => {
            chai.request(app)
                .put("/bpba/schedule/holiday/edit")
                .set("Authorization", `Bearer ${token}`)
                .send(libur)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it("Harus gagal Mengubah Jadwal Libur ", (done) => {
            const libur = {
                // tanggal_mulai: ,
                // tanggal_selesai: ,
                Keterangan: "Libur Nasional"
            }
            chai.request(app)
                .put("/bpba/schedule/holiday/edits")
                .set("Authorization", `Bearer ${token}`)
                .send(libur)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    })

    // delete hari libur
    describe("PUT /schedule/holiday/delete", () => {
        const libur = {
            id: 28
        }
        before(async () => {
            //get token
            let resToken = await loginWithDefaultUser();
            token = resToken.body.token;

        })
        it("Harus Mengubah Jadwal Libur ", (done) => {
            chai.request(app)
                .put("/bpba/schedule/holiday/delete")
                .set("Authorization", `Bearer ${token}`)
                .send(libur)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it("Harus gagal Mengubah Jadwal Libur ", (done) => {
            const libur = {
                id: 200
            }
            chai.request(app)
                .put("/bpba/schedule/holiday/deletes")
                .set("Authorization", `Bearer ${token}`)
                .send(libur)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    })
});
