const { app, remote } = require("electron");
const JSONdb = require("simple-json-db");
const mysql = require("mysql");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const browserUtility = require("./BrowserWindowUtility");
const { STATUSES, ACTIONS } = require("./constants");

const config = require("../config/db.config");

const configDir = (app || remote.app).getPath("userData");

const jsonDbConfig = {
  jsonSpaces: 2,
};

let db;
let browserWindow;

const migration = () => {
  let connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
  });
  this.executeQuery = (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (err) => {
        if (err) throw reject(err);
        resolve();
      });
    });
  };
  connection.connect((err) => {
    if (err) {
      console.log("connection error");
    } else {
      let untracked = db.get("untracked");
      let temp = untracked;
      untracked.map(async (item) => {
        let query = "";
        switch (item.flag) {
          case ACTIONS.ADD:
            query = `INSERT INTO scooters(name, phone, barcode, model, termen, series, km, problem, notes, price, signature, doneBy, codes, type, payment, statusId, createdAt) VALUES('${item.name}', '${item.phone}', '${item.barcode}', '${item.model}', '${item.termen}', '${item.series}', '${item.km}', '${item.problem}', '${item.notes}', '${item.price}', '', '${item.doneBy}', '${item.codes}', '${item.type}', '', ${item.statusId}, '${item.createdAt}')`;
            break;
          case ACTIONS.EDIT:
            switch (item.statusId) {
              case 1:
                query = `UPDATE scooters set name = '${item.name}', phone = '${item.phone}', barcode = '${item.barcode}', model = '${item.model}', termen = '${item.termen}', series = '${item.series}', km = '${item.km}', problem = '${item.problem}', notes = '${item.notes}', price = '${item.price}', signature = '${item.signature}', codes = '${item.codes}', type = '${item.type}', statusId = ${item.statusId}, createdAt = '${item.createdAt}' WHERE id = ${item.id}`;
                break;
              case 2:
                query = `UPDATE scooters set name = '${item.name}', phone = '${item.phone}', barcode = '${item.barcode}', model = '${item.model}', termen = '${item.termen}', series = '${item.series}', km = '${item.km}', problem = '${item.problem}', notes = '${item.notes}', price = '${item.price}', signature = '${item.signature}', doneBy = '${item.doneBy}', codes = '${item.codes}', type = '${item.type}', statusId = ${item.statusId}, updatedAt = '${item.updatedAt}' WHERE id = ${item.id}`;
                break;
              case 3:
                query = `UPDATE scooters set name = '${item.name}', phone = '${item.phone}', barcode = '${item.barcode}', model = '${item.model}', termen = '${item.termen}', series = '${item.series}', km = '${item.km}', problem = '${item.problem}', notes = '${item.notes}', price = '${item.price}', signature = '${item.signature}', warranty = '${item.warranty}', doneBy = '${item.doneBy}', codes = '${item.codes}', type = '${item.type}', payment = '${item.payment}', statusId = ${item.statusId}, finishedAt = '${item.finishedAt}' WHERE id = ${item.id}`;
                break;
            }
            break;
          case ACTIONS.DELETE:
            query = `DELETE from scooters WHERE id = ${item.id}`;
            break;
          default:
            break;
        }
        if (query) {
          console.log(query);
          await this.executeQuery(query);
          temp = temp.filter((obj) => obj.id !== item.id);
          db.set("untracked", temp);
        }
      });

      connection.query("SELECT id, payment, name, phone, barcode,model,termen,problem,price,createdAt,updatedAt,finishedAt,statusId FROM scooters", (err, rows) => {
        if (err) {
          console.log("An error ocurred performing the query.");
          console.log(err);
        }

        db.set("scooters", rows);
        browserWindow = browserUtility.getBrowserWindow();
        if (browserWindow !== undefined) {
          browserWindow.webContents.send("DATA_CHANGE");
        }
      });

      connection.end();
      return true;
    }
  });
  return true;
};

module.exports.initial = () => {
  const uploadPath = path.join(configDir, "uploads");
  if (!fs.existsSync(uploadPath)) {
    console.log("dir not exists");
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  db = new JSONdb(path.join(configDir, "data.json"), jsonDbConfig);

  if (!db.has("users")) {
    db.set("users", [
      {
        name: "Super Admin",
        email: "help@doctortrotineta.ro",
        password: bcrypt.hashSync("Doctortrotineta123", 8),
        roleId: 1,
      },
      {
        name: "General User",
        email: "comenzi@doctortrotineta.ro",
        password: bcrypt.hashSync("Doctortrotineta123", 8),
        roleId: 2,
      },
    ]);
  }

  if (!db.has("untracked")) {
    db.set("untracked", []);
  }

  let connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
  });
  // connect to mysql
  connection.connect(async (err) => {
    if (err) {
      if (!db.has("scooters")) {
        db.set("scooters", []);
      }
    } else {
      // db migration
      migration();
      connection.end();
    }
  });
};

module.exports.getUserByEmail = (email) => {
  const users = db.get("users");
  const user = users.find((item) => item.email === email);
  return user ? user : null;
};

module.exports.getProfile = () => {
  const profile = db.get("profile");
  return profile;
};

module.exports.getScooterList = (statusId = 0) => {
  let scooters;
  scooters = db.get("scooters");
  if (statusId) {
    scooters = scooters.filter((item) => item.statusId === parseInt(statusId));
  }
  return scooters;
};

module.exports.getScooterById = (id) => {
  let scooters;
  scooters = db.get("scooters");
  scooters = scooters.filter((item) => item.id === parseInt(id));
  if (scooters.length) {
    return scooters[0];
  } else {
    return null;
  }
};

module.exports.addScooter = (data) => {
  this.handleScooter = (value) => {
    let scooters = db.get("scooters");
    scooters.push(value);
    db.set("scooters", scooters);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  };
  this.handleUntracked = (value) => {
    let untracked = db.get("untracked");
    const temp = {
      ...value,
      flag: "add",
    };
    untracked.push(temp);
    db.set("untracked", untracked);
  };
  try {
    let connection = mysql.createConnection({
      host: config.HOST,
      user: config.USER,
      password: config.PASSWORD,
      database: config.DB,
    });
    return new Promise((resolve) => {
      connection.connect((err) => {
        if (err) {
          this.handleUntracked(data);
          this.handleScooter(data);
          console.log("case 1");
          resolve(data);
        } else {
          const query = `INSERT INTO scooters(name, phone, barcode, model, termen, series, km, problem, notes, price, signature, doneBy, codes, type, payment, statusId, createdAt) VALUES('${data.name}', '${data.phone}', '${data.barcode}', '${data.model}', '${data.termen}', '${data.series}', '${data.km}', '${data.problem}', '${data.notes}', '${data.price}', '', '${data.doneBy}', '${data.codes}', '${data.type}', '', ${data.statusId}, '${data.createdAt}')`;
          console.log("query:", query);
          connection.query(query, (err, result, fields) => {
            if (err) {
              this.handleUntracked(data);
              this.handleScooter(data);
              console.log("case 2");
              resolve(data);
            } else {
              data.id = result.insertId;
              this.handleScooter(data);
              migration();
              console.log("case 3");
              resolve(data);
            }
          });
          connection.end();
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateScooter = (data) => {
  this.handleScooter = (value) => {
    const scooters = db.get("scooters").map((item) => {
      let temp = Object.assign({}, item);
      if (temp.id === value.id) {
        temp = value;
      }
      return temp;
    });
    db.set("scooters", scooters);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  };
  this.handleUntracked = (value) => {
    console.log(value);
    let untracked = db.get("untracked");
    const exist = untracked.some((item) => item.id === value.id);
    if (exist) {
      untracked = untracked.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === value.id) {
          Object.keys(temp).forEach((key, index) => {
            if (value[key]) {
              temp[key] = value[key];
            }
          });
        }
        return temp;
      });
    } else {
      const temp = {
        ...value,
        flag: "edit",
      };
      untracked.push(temp);
    }
    db.set("untracked", untracked);
  };
  try {
    let connection = mysql.createConnection({
      host: config.HOST,
      user: config.USER,
      password: config.PASSWORD,
      database: config.DB,
    });
    connection.connect((err) => {
      if (err) {
        this.handleUntracked(data);
      } else {
        let query = "";
        switch (data.statusId) {
          case 1:
            query = `UPDATE scooters set name = '${data.name}', phone = '${data.phone}', barcode = '${data.barcode}', model = '${data.model}', termen = '${data.termen}', series = '${data.series}', km = '${data.km}', problem = '${data.problem}', notes = '${data.notes}', price = '${data.price}', signature = '${data.signature}', codes = '${data.codes}', type = '${data.type}', statusId = ${data.statusId}, createdAt = '${data.createdAt}' WHERE id = ${data.id}`;
            break;
          case 2:
            query = `UPDATE scooters set name = '${data.name}', phone = '${data.phone}', barcode = '${data.barcode}', model = '${data.model}', termen = '${data.termen}', series = '${data.series}', km = '${data.km}', problem = '${data.problem}', notes = '${data.notes}', price = '${data.price}', signature = '${data.signature}', doneBy = '${data.doneBy}', codes = '${data.codes}', type = '${data.type}', statusId = ${data.statusId}, updatedAt = '${data.updatedAt}' WHERE id = ${data.id}`;
            break;
          case 3:
            query = `UPDATE scooters set name = '${data.name}', phone = '${data.phone}', barcode = '${data.barcode}', model = '${data.model}', termen = '${data.termen}', series = '${data.series}', km = '${data.km}', problem = '${data.problem}', notes = '${data.notes}', price = '${data.price}', signature = '${data.signature}', warranty = '${data.warranty}', doneBy = '${data.doneBy}', codes = '${data.codes}', type = '${data.type}', payment = '${data.payment}', statusId = ${data.statusId}, finishedAt = '${data.finishedAt}' WHERE id = ${data.id}`;
            break;
        }
        connection.query(query, (err) => {
          if (err) {
            this.handleUntracked(data);
          }
          migration();
        });
        connection.end();
      }
    });
    this.handleScooter(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteScooter = (data) => {
  this.handleScooter = (value) => {
    const scooters = db.get("scooters").filter((item) => item.id !== value.id);
    db.set("scooters", scooters);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  };
  this.handleUntracked = (value) => {
    let untracked = db.get("untracked");
    const exist = untracked.some((item) => item.id === value.id);
    if (exist) {
      untracked = untracked.filter((item) => item.id !== value.id);
    } else {
      const temp = {
        ...value,
        flag: "delete",
      };
      untracked.push(temp);
    }
    db.set("untracked", untracked);
  };
  try {
    let connection = mysql.createConnection({
      host: config.HOST,
      user: config.USER,
      password: config.PASSWORD,
      database: config.DB,
    });
    connection.connect((err) => {
      if (err) {
        this.handleUntracked(data);
      } else {
        const query = `DELETE from scooters WHERE id = ${data.id}`;
        connection.query(query, (err, result, fields) => {
          if (err) {
            this.handleUntracked(data);
          }
          migration();
        });
        connection.end();
      }
    });
    this.handleScooter(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.synchronize = () => {
  this.executeQuery = (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (err) => {
        if (err) throw reject(err);
        resolve();
      });
    });
  };

  let connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
  });
  return new Promise((resolve) => {
    connection.connect(async (err) => {
      if (err) {
        resolve({
          status: STATUSES.ERROR,
          message: "DB Connection Error",
        });
      } else {
        let untracked = db.get("untracked");
        let temp = untracked;
        await Promise.all(
          untracked.map(async (item) => {
            let query = "";
            switch (item.flag) {
              case ACTIONS.ADD:
                query = `INSERT INTO scooters(name, phone, barcode, model, termen, series, km, problem, notes, price, signature, doneBy, codes, type, payment, statusId, createdAt) VALUES('${item.name}', '${item.phone}', '${item.barcode}', '${item.model}', '${item.termen}', '${item.series}', '${item.km}', '${item.problem}', '${item.notes}', '${item.price}', '', '${item.doneBy}', '${item.codes}', '${item.type}', '', ${item.statusId}, '${item.createdAt}')`;
                break;
              case ACTIONS.EDIT:
                switch (item.statusId) {
                  case 1:
                    query = `UPDATE scooters set name = '${item.name}', phone = '${item.phone}', barcode = '${item.barcode}', model = '${item.model}', termen = '${item.termen}', series = '${item.series}', km = '${item.km}', problem = '${item.problem}', notes = '${item.notes}', price = '${item.price}', signature = '${item.signature}', codes = '${item.codes}', type = '${item.type}', statusId = ${item.statusId}, createdAt = '${item.createdAt}' WHERE id = ${item.id}`;
                    break;
                  case 2:
                    query = `UPDATE scooters set name = '${item.name}', phone = '${item.phone}', barcode = '${item.barcode}', model = '${item.model}', termen = '${item.termen}', series = '${item.series}', km = '${item.km}', problem = '${item.problem}', notes = '${item.notes}', price = '${item.price}', signature = '${item.signature}', doneBy = '${item.doneBy}', codes = '${item.codes}', type = '${item.type}', statusId = ${item.statusId}, updatedAt = '${item.updatedAt}' WHERE id = ${item.id}`;
                    break;
                  case 3:
                    query = `UPDATE scooters set name = '${item.name}', phone = '${item.phone}', barcode = '${item.barcode}', model = '${item.model}', termen = '${item.termen}', series = '${item.series}', km = '${item.km}', problem = '${item.problem}', notes = '${item.notes}', price = '${item.price}', signature = '${item.signature}', warranty = '${item.warranty}', doneBy = '${item.doneBy}', codes = '${item.codes}', type = '${item.type}', payment = '${item.payment}', statusId = ${item.statusId}, finishedAt = '${item.finishedAt}' WHERE id = ${item.id}`;
                    break;
                }
                break;
              case ACTIONS.DELETE:
                query = `DELETE from scooters WHERE id = ${item.id}`;
                break;
              default:
                break;
            }
            console.log("query:", query);
            if (query) {
              await this.executeQuery(query);
              temp = temp.filter((obj) => obj.id !== item.id);
              db.set("untracked", temp);
            }
          }),
          connection.query("SELECT id, payment, name, phone, barcode,model,termen,problem,price,createdAt,updatedAt,finishedAt,statusId FROM scooters", (err, rows) => {
            if (err) {
              console.log("An error ocurred performing the query.");
              console.log(err);
            }
            db.set("scooters", rows);
            browserWindow = browserUtility.getBrowserWindow();
            browserWindow.webContents.send("DATA_CHANGE");
          })
        );
        connection.end();
        resolve({
          status: STATUSES.SUCCESS,
          message: "Successfully Synchronized!",
        });
      }
    });
  });
};
