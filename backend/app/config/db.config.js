module.exports = {
  HOST: '188.213.21.231',
  USER: 'doctortrotineta',
  PASSWORD: 'Mailsurf22!',
  // USER: 'root',
  // PASSWORD: '',
  DB: 'doctortrotineta_crm',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
