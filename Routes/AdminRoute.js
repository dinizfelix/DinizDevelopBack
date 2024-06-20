import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = `
    SELECT f.email, f.Nome, c.descricao 
    FROM Funcionario f 
    JOIN Cargo c ON f.idCargo = c.idCargo 
    WHERE f.email = ? AND f.password = ?`;

  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const { email, Nome, descricao } = result[0];
      const token = jwt.sign(
        { role: "admin", email: email, name: Nome, cargo: descricao },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({
        loginStatus: true,
        idToken: { jwtToken: token, refreshToken: "dummy_refresh_token" },
      });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.post("/add_cargo", (req, res) => {
  const sql = "INSERT INTO cargo (`descricao`) VALUES (?)";
  con.query(sql, [req.body.descricao], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.get("/cargo", (req, res) => {
  const sql = "SELECT * FROM cargo";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/edit_cargo/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM cargo WHERE idCargo=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_cargo/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from cargo WHERE idCargo= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});
router.put("/edit_cargo/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE cargo SET descricao=? WHERE idCargo=?`;
  const values = [req.body.descricao, id];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_funcionario", (req, res) => {
  const sql = `INSERT INTO funcionario 
    (Nome,Rg, Data_admissao, Salario, idCargo, email, password) 
    VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Query Error hash" });
    const values = [
      req.body.Nome,
      req.body.Rg,
      req.body.Data_admissao,
      req.body.Salario,
      req.body.idCargo,
      req.body.email,
      hash,
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error con" });
      return res.json({ Status: true });
    });
  });
});

router.get("/funcionario", (req, res) => {
  const sql =
    "SELECT f.*, c.descricao AS Cargo FROM funcionario f JOIN Cargo c ON f.idCargo = c.idCargo";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/edit_funcionario/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM funcionario WHERE idFuncionario=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_funcionario/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE funcionario SET Nome=?, Rg=?, Data_admissao=?, Salario=?, idCargo=?, email=? WHERE idFuncionario=?`;
  const values = [
    req.body.Nome,
    req.body.Rg,
    req.body.Data_admissao,
    req.body.Salario,
    req.body.idCargo,
    req.body.email,
    id,
  ];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_funcionario/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from funcionario WHERE idFuncionario= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_restaurante", (req, res) => {
  const sql = "INSERT INTO restaurante (`Nome`) VALUES (?)";
  con.query(sql, [req.body.Nome], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.get("/restaurante", (req, res) => {
  const sql = "SELECT * FROM restaurante";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/edit_restaurante/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM restaurante WHERE idRestaurante=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_restaurante/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from restaurante WHERE idRestaurante= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_restaurante/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE restaurante SET Nome=? WHERE idRestaurante=?`;
  const values = [req.body.Nome, id];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/referencia", (req, res) => {
  const sql = `
    SELECT r.*, f.Nome AS NomeFuncionario, re.Nome AS NomeRestaurante 
    FROM referencia r 
    JOIN funcionario f ON r.idFuncionario = f.idFuncionario 
    JOIN restaurante re ON r.idRestaurante = re.idRestaurante`;

  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_referencia", (req, res) => {
  const sql = `INSERT INTO referencia 
  (Data_Inicio, Data_Fim, idFuncionario, idRestaurante) 
  VALUES (?, ?,?,?)`;
  const values = [
    req.body.Data_Inicio,
    req.body.Data_Fim,
    req.body.idFuncionario,
    req.body.idRestaurante,
  ];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true });
  });
});

router.delete("/delete_referencia/:idFuncionario/:idRestaurante", (req, res) => {
  const idFuncionario = req.params.idFuncionario;
  const idRestaurante = req.params.idRestaurante;
  const sql = "DELETE from referencia WHERE idFuncionario=? AND idRestaurante=?";
  const values = [idFuncionario, idRestaurante];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/referencia/:idFuncionario/:idRestaurante", (req, res) => {
  const idFuncionario = req.params.idFuncionario;
  const idRestaurante = req.params.idRestaurante;
  const sql = "SELECT * FROM referencia WHERE idFuncionario=? AND idRestaurante=?";
  con.query(sql, [idFuncionario, idRestaurante], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_referencia/:idFuncionario/:idRestaurante", (req, res) => {
  const idFuncionario = req.params.idFuncionario;
  const idRestaurante = req.params.idRestaurante;
  const sql = `UPDATE referencia SET Data_Inicio=?, Data_Fim=?, idFuncionario=?, idRestaurante=?  WHERE idFuncionario=? AND idRestaurante=?`;
  const values = [
    req.body.Data_Inicio,
    req.body.Data_Fim,
    req.body.idFuncionario,
    req.body.idRestaurante,
    idFuncionario,
    idRestaurante,
  ];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_ingrediente", (req, res) => {
  const sql = "INSERT INTO ingrediente (`nome`) VALUES (?)";
  con.query(sql, [req.body.nome], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.get("/ingrediente", (req, res) => {
  const sql = "SELECT * FROM ingrediente";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/edit_ingrediente/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM ingrediente WHERE idIngrediente=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_ingrediente/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from ingrediente WHERE idIngrediente= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_ingrediente/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE ingrediente SET descricao=? WHERE idIngrediente=?`;
  const values = [req.body.descricao, id];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});
export { router as adminRouter };
