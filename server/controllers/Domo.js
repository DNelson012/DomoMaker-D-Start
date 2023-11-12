const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name level age').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.level || !req.body.age) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const domoData = {
    name: req.body.name,
    level: req.body.level,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();

    return res.status(201).json({
      name: newDomo.name,
      level: newDomo.level,
      age: newDomo.age,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

module.exports = {
  makerPage,
  getDomos,
  makeDomo,
};
