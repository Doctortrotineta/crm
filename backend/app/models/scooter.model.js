module.exports = (sequelize, Sequelize) => {
  const Scooter = sequelize.define('scooter', {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    barcode: {
      type: Sequelize.STRING
    },
    model: {
      type: Sequelize.STRING
    },
    termen: {
      type: Sequelize.STRING
    },
    problem: {
      type: Sequelize.STRING
    },
    notes: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    },
    series: {
      type: Sequelize.STRING
    },
    km: {
      type: Sequelize.STRING
    },
    signature: {
      type: Sequelize.STRING
    },
    warranty: {
      type: Sequelize.INTEGER,
    },
    doneBy: {
      type: Sequelize.STRING
    },
    codes: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    payment: {
      type: Sequelize.STRING
    },
    statusId: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1
    },
    createdAt: {
      type: 'TIMESTAMP',
    },
    updatedAt: {
      type: 'TIMESTAMP',
    },
    finishedAt: {
      type: 'TIMESTAMP',
    }
  });

  return Scooter;
};
