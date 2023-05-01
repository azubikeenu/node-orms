const express = require('express');

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use((req, res) => {
  return res
    .status(404)
    .json({ status: 'Error', message: ` ${req.path} not found` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
