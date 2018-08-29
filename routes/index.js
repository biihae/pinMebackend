var express = require('express')
var router = express.Router();
var mysql = require('mysql');

const AHP = require('ahp');


var pool = mysql.createPool({
	host: '35.198.235.154',
	user: 'root',
	password: '123456',
	database: 'cariLokasi',
	port: 3306,
	multipleStatements: true
	// host: 'localhost',
	// user: 'root',
	// password: '',
	// database: 'carilokasi',
	// port: 3306,
	// multipleStatements: true
})

router.post('/api/ahp', function (req, res, next) {
	var row
	var bobot = req.body.bobot;
	pool.getConnection(function (err, connection) {
		connection.query('Select * from modelahp', function (err, rows, field) {
			if (err) {
				console.log(err);

			} else {
				var blok_m = [], pasfes = [], pancoran = [];
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].daerah == 'blok_m') {
						blok_m = rows[i]
					} else if (rows[i].daerah == 'pasfes') {
						pasfes = rows[i]
					} else if (rows[i].daerah == 'pancoran') {
						pancoran = rows[i]
					}
				}
				console.log(blok_m.penduduk);

				let ITEMS = ['pasfes', 'pancoran', 'blok_m'];

				// sub-criteria scores
				let demografiScores = new AHP().import({
					items: ITEMS,
					criteria: ['penduduk', 'kk', 'desa'],
					criteriaItemRank: {
						'penduduk': [
							[(pasfes.penduduk / pasfes.penduduk), (pasfes.penduduk / pancoran.penduduk), (pasfes.penduduk / blok_m.penduduk)],
							[(pancoran.penduduk / pasfes.penduduk), (pancoran.penduduk / pancoran.penduduk), (pancoran.penduduk / blok_m.penduduk)],
							[(blok_m.penduduk / pasfes.penduduk), (blok_m.penduduk / pancoran.penduduk), (blok_m.penduduk / blok_m.penduduk)]
						],
						'kk': [
							[(pasfes.kk / pasfes.kk), (pasfes.kk / pancoran.kk), (pasfes.kk / blok_m.kk)],
							[(pancoran.kk / pasfes.kk), (pancoran.kk / pancoran.kk), (pancoran.kk / blok_m.kk)],
							[(blok_m.kk / pasfes.kk), (blok_m.kk / pancoran.kk), (blok_m.kk / blok_m.kk)]
						],
						'desa': [
							[(pasfes.desa / pasfes.desa), (pasfes.desa / pancoran.desa), (pasfes.desa / blok_m.desa)],
							[(pancoran.desa / pasfes.desa), (pancoran.desa / pancoran.desa), (pancoran.desa / blok_m.desa)],
							[(blok_m.desa / pasfes.desa), (blok_m.desa / pancoran.desa), (blok_m.desa / blok_m.desa)]
						]
					},
					criteriaRank: [
						[bobot[16], bobot[17], bobot[18]],
						[bobot[19], bobot[20], bobot[21]],
						[bobot[22], bobot[23], bobot[24]]

					]
				}).run().rankedScores;

				let retailScores = new AHP().import({
					items: ITEMS,
					criteria: ['gedung', 'bus'],
					criteriaItemRank: {
						'gedung': [
							[(pasfes.gedung / pasfes.gedung), (pasfes.gedung / pancoran.gedung), (pasfes.gedung / blok_m.gedung)],
							[(pancoran.gedung / pasfes.gedung), (pancoran.gedung / pancoran.gedung), (pancoran.gedung / blok_m.gedung)],
							[(blok_m.gedung / pasfes.gedung), (blok_m.gedung / pancoran.gedung), (blok_m.gedung / blok_m.gedung)]
						],
						'bus': [
							[(pasfes.bus / pasfes.bus), (pasfes.bus / pancoran.bus), (pasfes.bus / blok_m.bus)],
							[(pancoran.bus / pasfes.bus), (pancoran.bus / pancoran.bus), (pancoran.bus / blok_m.bus)],
							[(blok_m.bus / pasfes.bus), (blok_m.bus / pancoran.bus), (blok_m.bus / blok_m.bus)]

						]
					},
					criteriaRank: [
						[bobot[25], bobot[26]],
						[bobot[27], bobot[28]]

					]
				}).run().rankedScores;

				let poiScores = new AHP().import({
					items: ITEMS,
					criteria: ['rumah', 'pemerintah', 'pendidikan', 'komersil',
						'rekreasi'],
					criteriaItemRank: {
						'rumah': [
							[(pasfes.rumah / pasfes.rumah), (pasfes.rumah / pancoran.rumah), (pasfes.rumah / blok_m.rumah)],
							[(pancoran.rumah / pasfes.rumah), (pancoran.rumah / pancoran.rumah), (pancoran.rumah / blok_m.rumah)],
							[(blok_m.rumah / pasfes.rumah), (blok_m.rumah / pancoran.rumah), (blok_m.rumah / blok_m.rumah)]
						],
						'pemerintah': [
							[(pasfes.pemerintah / pasfes.pemerintah), (pasfes.pemerintah / pancoran.pemerintah), (pasfes.pemerintah / blok_m.pemerintah)],
							[(pancoran.pemerintah / pasfes.pemerintah), (pancoran.pemerintah / pancoran.pemerintah), (pancoran.pemerintah / blok_m.pemerintah)],
							[(blok_m.pemerintah / pasfes.pemerintah), (blok_m.pemerintah / pancoran.pemerintah), (blok_m.pemerintah / blok_m.pemerintah)]
						],
						'pendidikan': [
							[(pasfes.pendidikan / pasfes.pendidikan), (pasfes.pendidikan / pancoran.pendidikan), (pasfes.pendidikan / blok_m.pendidikan)],
							[(pancoran.pendidikan / pasfes.pendidikan), (pancoran.pendidikan / pancoran.pendidikan), (pancoran.pendidikan / blok_m.pendidikan)],
							[(blok_m.pendidikan / pasfes.pendidikan), (blok_m.pendidikan / pancoran.pendidikan), (blok_m.pendidikan / blok_m.pendidikan)]
						],
						'komersil': [
							[(pasfes.komersil / pasfes.komersil), (pasfes.komersil / pancoran.komersil), (pasfes.komersil / blok_m.komersil)],
							[(pancoran.komersil / pasfes.komersil), (pancoran.komersil / pancoran.komersil), (pancoran.komersil / blok_m.komersil)],
							[(blok_m.komersil / pasfes.komersil), (blok_m.komersil / pancoran.komersil), (blok_m.komersil / blok_m.komersil)]
						],
						'rekreasi': [
							[(pasfes.rekreasi / pasfes.rekreasi), (pasfes.rekreasi / pancoran.rekreasi), (pasfes.rekreasi / blok_m.rekreasi)],
							[(pancoran.rekreasi / pasfes.rekreasi), (pancoran.rekreasi / pancoran.rekreasi), (pancoran.rekreasi / blok_m.rekreasi)],
							[(blok_m.rekreasi / pasfes.rekreasi), (blok_m.rekreasi / pancoran.rekreasi), (blok_m.rekreasi / blok_m.rekreasi)]

						]
					},
					criteriaRank: [
						[bobot[29], bobot[30], bobot[31], bobot[32], bobot[33]],
						[bobot[34], bobot[35], bobot[36], bobot[37], bobot[38]],
						[bobot[39], bobot[40], bobot[41], bobot[42], bobot[43]],
						[bobot[44], bobot[45], bobot[46], bobot[47], bobot[48]],
						[bobot[49], bobot[50], bobot[51], bobot[52], bobot[53]]
					]
				}).run().rankedScores;

				let kompetitorScores = new AHP().import({
					items: ITEMS,
					criteria: ['kompetitor'],
					criteriaItemRank: {
						'kompetitor': [
							[(pasfes.kompetitor / pasfes.kompetitor), (pasfes.kompetitor / pancoran.kompetitor), (pasfes.kompetitor / blok_m.kompetitor)],
							[(pancoran.kompetitor / pasfes.kompetitor), (pancoran.kompetitor / pancoran.kompetitor), (pancoran.kompetitor / blok_m.kompetitor)],
							[(blok_m.kompetitor / pasfes.kompetitor), (blok_m.kompetitor / pancoran.kompetitor), (blok_m.kompetitor / blok_m.kompetitor)]
						]
					},
					criteriaRank: [
						[1]
					]
				}).run().rankedScores;

				// main matrix
				let output = new AHP().import({
					items: ITEMS,
					criteria: ['demografi', 'retail', 'poi', 'kompetitor'],
					criteriaItemRank: {
						demografi: demografiScores,
						retail: retailScores,
						poi: poiScores,
						kompetitor: kompetitorScores
					},
					criteriaRank: [
						[bobot[0], bobot[1], bobot[2], bobot[3]],
						[bobot[4], bobot[5], bobot[6], bobot[7]],
						[bobot[8], bobot[9], bobot[10], bobot[11]],
						[bobot[12], bobot[13], bobot[14], bobot[15]]
					]
				}).run();
				console.log(output);

				res.json(output);
			}
		});
	});


});

// router.get('/api/akses', function (req, res, next) {
// 	var lokasi = req.query.loc;
// 	pool.getConnection(function (err, connection) {
// 		connection.query('Select * from akses where lokasi_buf = ?', [lokasi], function (err, rows, field) {
// 			if (err) {
// 				console.log(err)
// 			} else if (rows == '') {
// 				console.log('data not found')
// 				res.json('data tidak ditemukan')
// 			} else {
// 				console.log(rows)
// 				res.json(rows)
// 			}
// 		})
// 	})
// })


// router.get('/api/demografi', function (req, res, next) {
// 	var lokasi_buf = req.query.dem;
// 	pool.getConnection(function (err, connection) {
// 		connection.query('Select * from demografi where lokasi_buf = ?', [lokasi_buf], function (err, rows, field) {
// 			if (err) {
// 				console.log(err)
// 			} else if (rows == '') {
// 				console.log('data tidak ditemukan')
// 			} else {
// 				console.log(rows)
// 				res.json(rows)
// 			}
// 		})
// 	})
// })

var password, username;
router.post('/login', function (req, res, next) {
	username = req.body.username;
	password = req.body.password;
	username = username.toLowerCase();
	var login_status;
	pool.getConnection(function (err, connection) {
		connection.query('select * from login where username =?', [username], function (err, rows, field) {
			if (rows == undefined) {
				login_status = "fail";
				res.json({ login_status: login_status });
			}
			else {
				console.log(password)
				if (password != rows[0].password) {
					login_status = "fail";
					res.json({ login_status: login_status });
				}
				login_status = "success";
				res.json({
					login_status: login_status,
					name: rows[0].username,
					statusUser: rows[0].role
				});
			}

		});

	});
});

var passwordregist, nameregist;
router.post('/register', function (req, res, next) {
	nameregist = req.body.nameregist;
	passwordregist = req.body.passwordregist;
	nameregist = nameregist.toLowerCase();
	console.log(nameregist, passwordregist);

	var register_status;
	pool.getConnection(function (err, connection) {
		connection.query('select * from login where username =?', [nameregist], function (err, rows, field) {
			console.log(rows[0])
			if (rows[0] != undefined) {
				res.json({ register_status: "fail" });

			}
			else if (rows[0] == undefined) {
				console.log('input to db')
				connection.query('insert into login (username , password) values (?,?)', [nameregist, passwordregist], function (err, rows, field) {
					res.json({ register_status: "success" });
				});
			}

		});

	});

});

router.post('/savesAhp', function (req, res, next) {
	var nilai = req.body.nilai;
	console.log(nilai[33])

	pool.getConnection(function (err, connection) {
		var updatequery = "update modelahp set penduduk = ? , kk= ? , desa= ? , gedung =? , bus =? , rumah =? , pemerintah=? , pendidikan=? , komersil =? , rekreasi =? , kompetitor =?  where daerah='pasfes';  update modelahp set penduduk = ? , kk= ? , desa= ? , gedung =? , bus =? , rumah =? , pemerintah=? , pendidikan=? , komersil =? , rekreasi =? , kompetitor =?  where daerah='pancoran'; update modelahp set penduduk = ? , kk= ? , desa= ? , gedung =? , bus =? , rumah =? , pemerintah=? , pendidikan=? , komersil =? , rekreasi =? , kompetitor =?  where daerah='blok_m';"
		connection.query(updatequery, [nilai[0], nilai[3], nilai[6], nilai[9], nilai[12], nilai[15], nilai[18], nilai[22], nilai[24], nilai[27], nilai[30], nilai[1], nilai[4], nilai[7], nilai[10], nilai[13], nilai[16], nilai[19], nilai[22], nilai[25], nilai[28], nilai[31], nilai[2], nilai[5], nilai[8], nilai[11], nilai[14], nilai[17], nilai[20], nilai[23], nilai[26], nilai[29], nilai[32]], function (err, rows, field) {
			if (err) {
				console.log(err)
				res.json(err)
			} else {
				res.json('success');
			}
		});
	});
});

router.post('/cekAhp', function (req, res, next) {
	var cek_status;
	pool.getConnection(function (err, connection) {
		connection.query('select * from modelahp ', function (err, rows, field) {
			console.log(rows[0])
			if (rows[0] != undefined) {
				res.json({ cek_status: "success" });
			}
			else if (rows[0] == undefined) {
				res.json({ cek_status: "fail" });

			}

		});

	});

});

router.get('/cekData', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		connection.query('select * from modelahp ', function (err, rows, field) {
			console.log(rows[0].daerah)
			var pasfes = [],
				pancoran = [],
				blok_m = [];

			for (var i = 0; i < rows.length; i++) {
				if (rows[i].daerah == "pasfes") {
					pasfes = rows[i];
				}
				else if (rows[i].daerah == "pancoran") {
					pancoran = rows[i];
				}
				else if (rows[i].daerah == "blok_m") {
					blok_m = rows[i];
				}
			}
			res.json({
				pasfes: pasfes,
				pancoran: pancoran,
				blok_m: blok_m
			})

		});
	});
});

module.exports
module.exports = router;
