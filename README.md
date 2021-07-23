# Bank Application for Booking Services

In this project, I created a backend program for bank applications, where customers who can book banking services meet with bank assistants.

In this project, users who can access the program divided into 4 roles, namely Banking Premium Booking Administrator (BPBA), Personal Banking Assistance Manager (PBAM), Personal Banking Assistant (PBA), and Priority Customer (PCu).

In this project, there are log in and log out features. After logging in, a token will be given, where each user with a specific token can only access some APIs, based on their roles.

This program created using the Node.js programming language, the ExpressJS framework, Sequelize ORM, and MySQL database. ER diagrams from the database used in this project are:

![ER Diagrams](https://github.com/farhanbudi/Aplikasi-untuk-Bank-Booking-Services/blob/main/file/ER%20Diagrams.png)

### Features and API for the main page:
* Users can login dan logout. API:
    - POST /auth/login
    - GET /auth/logout


### Features and APIs that can be possible to do by BPBA are:
*	BPBA can add users, search for users based on some criteria (role, name, email), edit users, enable and disable users in Users database table. API:
    - POST /bpba/admin/add
    - GET /bpba/admin/list-user
    - GET /bpba/admin/find-by-role/:role
    - GET /bpba/admin/find-by-name/:name
    - GET /bpba/admin/find-by-email/:email 
    - PUT /bpba/admin/update/:email

*	BPBA can perform CRUD operations in Jadwal Libur database table. API:
    - POST /bpba/schedule/holiday/add
    - GET /bpba/schedule/holiday
    - PUT /bpba/schedule/holiday/edit/:id 
    - PUT /bpba/schedule/holiday/delete/:id

*	BPBA can manage one PBAM can control several PBAs, and one PBA can handle several PCUs in the Users database table. API:
    - PUT /bpba/admin/set-pba-dari-pbam
    - PUT /bpba/admin/set-pcu-dari-pba

*	BPBA can add, view, and change meeting places in Tempat database table. API:
    - POST /bpba/location/add
    - PUT /bpba/location/edit/:id_location
    - GET /bpba/location/find-all


### Features and APIs that can be possible to do by PCu are:
*	PCu can order a schedule to meet with PBAs. When PCu orders a meeting schedule, this schedule may not coincide with the PBA's holiday schedule, PBA's leave schedule, and other appointments from that PBA with other PCu. API:  
    - POST /pcu/meet/add

*	PCu can change and cancel the meeting schedule before the D-day. API:
    - PUT /pcu/meet/change/:id_pertemuan
    - PUT /pcu/meet/cancel/:id_pertemuan

*	PCu can provide feedback to the PBA after conduct the meeting, and view the feedback history. API:
    - PUT /pcu/feedback/:id_pertemuan
    - GET /pcu/meet/find/:id_pertemuan
    - GET /pcu/meet/find-by-pcu/:id_pcu


### Features and APIs that can be possible to do by PBA are:
*	PBA can confirm or reject the appointment schedule made by PCU. If PBA refuse, PBA can provide reasons for the refusal. API:
    - PUT /pba/meet/confirmed/:id_pertemuan
    - PUT /pba/meet/rejected/:id_pertemuan

*	PBA can provide feedback to the PBA after conduct the meeting, and view the feedback history. API:
    - PUT /pba/feedback/:id_pertemuan
    - GET /pba/meet/find/:id_pertemuan
    - GET /pba/meet/find-by-pba/:id_pba


### Features and APIs that can be possible to do by PBAM are:
*	PBAM can add, edit, and delete meeting schedules between PBA and PCU in Jadwal Pertemuan database table. API:
    - POST /pbam/meet/add
    - PUT /pbam/meet/change/:id_pertemuan
    - PUT /pbam/meet/delete/:id_pertemuan

*	PBAM can add, edit, delete, and view leave schedules for certain PBAs in Jadwal Cuti database table. API:
    - POST /pbam/schedule/cuti/add
    - PUT /pbam/schedule/cuti/edit/:id_cuti
    - PUT /pbam/schedule/cuti/delete/:id_cuti
    - GET /pbam/schedule/cuti/find-all.

*	PBAM can view daily reports and rank order according to the meeting rating for each PBA. API:
    - GET /pbam/report/:tanggal
    - GET /pbam/report/:tanggal/:id_pba
    - GET /report/rank/:tanggal.

Portfolio for this project in pdf can be accessed [here](https://github.com/farhanbudi/Aplikasi-untuk-Bank-Booking-Services/blob/main/file/Portofolio%20Farhan%20Nurizky.pdf)
