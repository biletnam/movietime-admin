const express = require('express');
const app = express();

const uuidv4 = require('uuid/v4');

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());

const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'charon',
    database: 'coba_movietime_01'
});
db.connect();

//Login
app.post('/adminlogin', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      
      if (user.kode == '001') {
          // nyimpen sessionID di server
          let sql = `INSERT INTO admin_session(session_id, admin_id, expired_date) VALUES ('${user.session_id}',(select id from admin where email='${user.email}'), NOW() + INTERVAL 1 DAY)`;
          db.query(sql, (err, result) => {
              if(err) throw err;
              res.send(user)
          })
      } else {
          res.send(user)
      }
      
    }) (req, res, next);
  });
  
  passport.use(new LocalStrategy ({
      usernameField: 'email',
      passwordField: 'password',
  },
      (email, password, done) => {
        // console.log(`Email Line 48: ${email}`)
        // console.log(`Password Line 49: ${password}`)

          let sql =  `select count(*) hitung from admin where email = '${email}' and password = '${password}'`
          db.query(sql, (err, result) => {
          
              if (err) throw err;
              if (result[0].hitung == 1){
                  console.log(`Admin Berhasil Login - Passport`)
                  let sessionID = uuidv4()
                  return done(null, { kode: '001', email: email, session_id: sessionID });
  
              } else {
                  console.log(`Admin Gagal Login - Passport`)
                  return done(null, false, { message: 'Incorrect username or password.' });
              }                      
          })
      }
  ))

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/', failureFlash: true }));

//Untuk logout
app.post('/logout', (req, res) => {
    let sql =  `delete from admin_session where session_id = '${req.body.cookieMovietime}'`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            kode: '001',
            status: 'Berhasil hapus session',
	});
    })
})

//Untuk cek apakah ada cookie
app.post('/cookie', (req, res) => {
    // console.log(`Ini req.body cookie: ${req.body.cookieMovietime}`)
    let sql =  `select count(*) hitung from admin_session where session_id = '${req.body.cookieMovietime}'`    
    db.query(sql, (err, result) => {

        if (result[0].hitung == 1){
            console.log(`Ada session dengan cookie_admin tersebut di server`)
            res.send({
                kode: '001',
                status: 'Ada session dengan cookie_admin tersebut di server'
            });

        } else {
            console.log(`Tidak ada session dengan cookie_admin tersebut di server`)
            res.send({
                kode: '002',
                status: 'Tidak ada session dengan cookie_admin tersebut di server'
            });
        }    
    });
})

//Untuk mengambil semua data movie
app.get('/movie', (req, res) => {
    let sql = `SELECT * FROM movie`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

//Untuk menambah film
app.post('/addmovie', (req, res) => {
    let sql = `insert into movie values ('${req.body.id}',"${req.body.movie_name}", ${req.body.moviedb_id}, "${req.body.backdrop}", "${req.body.poster}", "${req.body.tagline}", "${req.body.overview}")`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            status: 'Berhasil menambambah movie',
            id: req.body.id,
            movie_name: req.body.movie_name,
            moviedb_id: req.body.moviedb_id,
            tagline: req.body.movie_tagline,
            overview: req.body.movie_overview,
            poster: req.body.movie_poster,
            backdrop: req.body.movie_backdrop,
        })
    })
})

//Untuk menghapus film
app.post('/deletemovie', (req, res) => {
    let sql = `delete from movie where id = '${req.body.id}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            status: 'Berhasil menambambah movie',
            id: req.body.id,
        })
    })
})

//Untuk memperbaharui film
app.post('/updatemovie', (req, res) => {
    let sql = `update movie set movie_name = '${req.body.movie_name}', moviedb_id = ${req.body.moviedb_id}, backdrop = "${req.body.backdrop}", poster = "${req.body.poster}", tagline = "${req.body.tagline}", overview = "${req.body.overview}"  where id = '${req.body.id}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            status: 'Berhasil memperbaharui movie',
            id: req.body.id,
        })
    })
})

//Untuk mengambil semua data screening
app.get('/screening', (req, res) => {
    let sql = `SELECT * FROM screening`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

//Untuk menambah screening
app.post('/addscreening', (req, res) => {
    let sql = `insert into screening values (
                '${req.body.screening_id}',
                '${req.body.movie_id}',
                ${req.body.cinema_id},
                '${req.body.theater_id}',
                '${req.body.day}',
                '${req.body.date_time}',
                ${req.body.price}
                )`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            status: 'Berhasil menambah screening',
        })
    })
})

//Untuk menghapus screening
app.post('/deletescreening', (req, res) => {
    let sql = `delete from screening where id = '${req.body.id}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            status: 'Berhasil menghapus screening',
        })
    })
})

//Untuk memperbaharui screening
app.post('/updatescreening', (req, res) => {
    let sql = `update screening set 
                    movie_id = '${req.body.movie_id}', 
                    cinema_id = ${req.body.cinema_id}, 
                    theater_id = '${req.body.theater_id}', 
                    day = '${req.body.day}', 
                    date_time = '${req.body.date_time}', 
                    price = ${req.body.price} 
                    where id = '${req.body.id}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send({
            status: 'Berhasil memperbaharui screening',
            id: req.body.id,
        })
    })
})

app.listen(6001, () => {
    console.log(`Listening to port 6001`)
});