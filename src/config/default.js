const config = {
  "db": {
    "database": "fakezhihu",
    "username": "origin",
    "password": "104.225.232.232-dzvpn-origin",
    "options": {
      "dialect": "mysql",
      "host": "104.225.232.232",
      "port": 3306,
      "operatorsAliases": false,
      "define": {
        "underscored": false,
        "freezeTableName": true,
        "charset": "utf8",
        "dialectOptions": {
          "collate": "utf8_general_ci"
        },
        "engine": "InnoDB"
      },
      "pool": {
        "min": 2,
        "max": 10,
        "idle": 300000
      }
    }
  },
  "server": {
    "port": 9929
  },
  "mailUrl": "http://127.0.0.1:8987/register",
};

module.exports = config;