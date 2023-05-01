const express = require('express');
const joi = require('joi');

const { getItems, insertItem, updateItem, deleteItem } = require('./db');

const itemSchema = joi.object({
  name: joi.string().required(),
  quantity: joi.number().min(1),
});

const router = express.Router();

router.post('/items', (req, respose) => {
  const item = req.body;
  const result = itemSchema.validate(item, { abortEarly: false });
  if (result.error) {
    return respose.status(400).json({ status: 'error', message: result.error });
  }

  insertItem(item)
    .then((data) => respose.status(200).json({ status: 'succcess', data }))
    .catch((err) =>
      respose.status(500).json({ status: 'error', message: err?.message })
    );
});

router.get('/items', (req, respose) => {
  getItems()
    .then((data) => respose.status(200).json({ status: 'succcess', data }))
    .catch((err) =>
      respose.status(500).json({ status: 'error', message: err?.message })
    );
});

router.delete('/items/:id', (req, respose) => {
  const idSchema = joi.string().required();

  const { id } = req.params;
  const result = idSchema.validate(id);
  if (result.error) {
    return respose.status(400).json({ status: 'error', message: result.error });
  }
  deleteItem(id)
    .then(() => {
      return respose.status(200).send(`item deleted`);
    })
    .catch((err) =>
      respose.status(500).json({ status: 'error', message: err?.message })
    );
});

module.exports = router;
